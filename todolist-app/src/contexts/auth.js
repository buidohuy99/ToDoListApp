import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { useHistory } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setLoadingPrompt } from '../redux/loading/loadingSlice';

import signalR from '../utils/signalR';

export const accesstoken_keyname = process.env.REACT_APP_ACCESSTOKEN_KEYNAME;
export const refreshtoken_keyname = process.env.REACT_APP_REFRESHTOKEN_KEYNAME;
export const uid_keyname = "userId";

const AuthAxios = axios.create({
    validateStatus : (status) => {
        return (status >= 200 && status < 300) || (status === 304);
    }
});

export {AuthAxios};

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({children}){
    const [accessToken, setAccessToken] = useState(localStorage.getItem(accesstoken_keyname));
    const dispatch = useDispatch();
    const history = useHistory();

    let connection = useRef(null);

    const updateAccessToken = async () => {
        try{
          const {token, uid} = (await AuthAxios.post(process.env.REACT_APP_API_URL + '/main-business/v1/authentication/refresh-token')).data;
          localStorage.setItem(accesstoken_keyname, token);
          localStorage.setItem(uid_keyname, uid);
          return token;
        }catch(e){
          localStorage.removeItem(accesstoken_keyname);
          localStorage.removeItem(uid_keyname);
          return null;
        }
    }

    const isUnAuthorizedError = (error) => {
        return error.config && error.response && error.response.status === 401;
    }
      
    const shouldRetry = (config) => {
        return config.retries.count < 3;
    }

    const default_request_interceptor = AuthAxios.interceptors.request.use(
        config => {
            const { origin } = new URL(config.url);
            const allowedOrigins = [process.env.REACT_APP_API_URL];
            const access_token = localStorage.getItem(accesstoken_keyname);
            if (allowedOrigins.includes(origin) && access_token && access_token !== 'null') {    
                config.headers['Authorization'] = `Bearer ${access_token}`;
            }
            config.headers['Access-Control-Allow-Origin'] = undefined;
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );
      
    const default_response_interceptor = AuthAxios.interceptors.response.use(
        (res) => {
          return res;
        },
        async (error) => {
            error.config.retries = error.config.retries || { count: 0,};
    
            if (isUnAuthorizedError(error) && shouldRetry(error.config)) {
                const new_access = await updateAccessToken(); // refresh the access token
                error.config.retries.count++;
                
                if(new_access){
                    error.config.headers['Authorization'] = `Bearer ${new_access}`;
                    setToken(new_access);
                }
                
                return AuthAxios.request(error.config); // if succeed in getting a new access token, re-fetch the original request with the updated accessToken
            }else if(isUnAuthorizedError(error) && !shouldRetry(error.config)){
                setToken(null);
            }
    
            return Promise.reject(error);
        }
    );

    const removeInterceptorForeverFromAxios = () => {
        AuthAxios.interceptors.request.eject(default_request_interceptor);
        AuthAxios.interceptors.response.eject(default_response_interceptor);
    };

    const setToken = (data) => {
        if(data){
            localStorage.setItem(accesstoken_keyname, data);
        }else{
            localStorage.removeItem(accesstoken_keyname);
            localStorage.removeItem(uid_keyname);
        }
        setAccessToken(data);
    }

    const value = {
        access_token: accessToken,
        set_access_token: setToken
    };

    useEffect(() => { 
        const recheckAccessToken = async() => {
            if(!connection.current){
                dispatch(setLoadingPrompt("Establishing connection to server...."));
                try{
                    await signalR.start();
                    connection.current = signalR; 
                } catch (e) {
                    setToken(null);
                    dispatch(setLoadingPrompt(null));
                    return;
                }
            }

            //Check token part
            let existingToken = localStorage.getItem(accesstoken_keyname);
            if(existingToken && existingToken !== 'null'){
                dispatch(setLoadingPrompt("Checking your login credentials, please wait..."));
                try{      
                    // vvvvv Check if access token is valid. if not valid will try to refresh the token => if refresh is successful, access token inside storage will automatically update. Otherwise, will throw an error vvvvvvvvv
                    await AuthAxios.post(process.env.REACT_APP_API_URL + '/main-business/v1/authentication/check-token-valid');            
                    existingToken = localStorage.getItem(accesstoken_keyname);
                    await signalR.invoke("Login", parseInt(localStorage.getItem(uid_keyname)));
                    setToken(existingToken);
                }catch(err){
                    setToken(null);
                }
            } else {
                setToken(null);
            }
            dispatch(setLoadingPrompt(null));
        };

        const unlisten = history.listen((location, action) => {
            recheckAccessToken();
        });

        recheckAccessToken();

        return () => {
          removeInterceptorForeverFromAxios();
          unlisten();
        }
    }, []);

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
}