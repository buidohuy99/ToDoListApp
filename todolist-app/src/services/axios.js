import axios from 'axios';

const AuthAxios = axios.create({
    validateStatus : (status) => {
        return (status >= 200 && status < 300) || (status === 304);
    }
});

// class to call API requests
class APIWorker {
    static callAPI = (method, url) => {
        return AuthAxios({
            method: method,
            url: process.env.REACT_APP_API_URL + url
        });
    };

    static postAPI = (url, data) => {
        return AuthAxios.post(process.env.REACT_APP_API_URL + url, data);
    };

    static putAPI = (url, data) => {
        return AuthAxios.put(process.env.REACT_APP_API_URL + url, data);
    };

    static patchAPI = (url, data) => {
        return AuthAxios.patch(process.env.REACT_APP_API_URL + url, data);
    };
}

export {AuthAxios, APIWorker};