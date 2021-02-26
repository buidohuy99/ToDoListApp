import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { useHistory } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setLoadingPrompt } from '../redux/loading/loadingSlice';

export const accesstoken_keyname = process.env.REACT_APP_ACCESSTOKEN_KEYNAME;
export const refreshtoken_keyname = process.env.REACT_APP_REFRESHTOKEN_KEYNAME;

const AuthAxios = axios.create({
    validateStatus : (status) => {
        return (status >= 200 && status < 300) || (status === 304);
    }
});
  
const updateAccessToken = async () => {
    try{
      const {Token} = (await AuthAxios.post(process.env.REACT_APP_API_URL + '/main-business/v1/authentication/refresh-token')).data;
      localStorage.setItem(accesstoken_keyname, Token);
      return Token;
    }catch(e){
      localStorage.removeItem(accesstoken_keyname);
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
        const {set_access_token} = useAuth();

        error.config.retries = error.config.retries || { count: 0,};

        if (isUnAuthorizedError(error) && shouldRetry(error.config)) {
            const new_access = await updateAccessToken(); // refresh the access token
            error.config.retries.count++;
            
            if(new_access){
                error.config.headers['Authorization'] = `Bearer ${new_access}`;
                set_access_token(new_access);
            }
            
            return AuthAxios.request(error.config); // if succeed in getting a new access token, re-fetch the original request with the updated accessToken
        }else if(isUnAuthorizedError(error) && !shouldRetry(error.config)){
            set_access_token(null);
        }

        return Promise.reject(error);
    }
);

export {AuthAxios};

const removeInterceptorForeverFromAxios = () => {
  AuthAxios.interceptors.request.eject(default_request_interceptor);
  AuthAxios.interceptors.response.eject(default_response_interceptor);
}

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({children}){
    const [accessToken, setAccessToken] = useState(localStorage.getItem(accesstoken_keyname));
    const dispatch = useDispatch();
    const history = useHistory();

    const setToken = (data) => {
        if(data){
            localStorage.setItem(accesstoken_keyname, data);
        }else{
            localStorage.removeItem(accesstoken_keyname);
        }
        setAccessToken(data);
    }

    const value = {
        access_token: accessToken,
        set_access_token: setToken
    };

    useEffect(() => { 
        const recheckAccessToken = async() => {
            let existingToken = localStorage.getItem(accesstoken_keyname);
            if(existingToken && existingToken !== 'null'){
                dispatch(setLoadingPrompt("Checking your login credentials, please wait..."));
                try{    
                    existingToken = localStorage.getItem(accesstoken_keyname);
                    // vvvvv Check if access token is valid. if not valid will try to refresh the token => if refresh is successful, access token inside storage will automatically update. Otherwise, will throw an error vvvvvvvvv
                    await AuthAxios.post(process.env.REACT_APP_API_URL + '/main-business/v1/authentication/check-token-valid');            
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