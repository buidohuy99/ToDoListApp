import axios from 'axios';

const AuthAxios = axios.create({
    validateStatus : (status) => {
        return (status >= 200 && status < 300) || (status === 304);
    }
});

// class to call API requests
class APIWorker {
    static callAPI = async (method, url) => {
        return await AuthAxios({
            method: method,
            url: process.env.REACT_APP_API_URL + url
        });
    };

    static postAPI = async (url, data) => {
        return await AuthAxios.post(process.env.REACT_APP_API_URL + url, data);
    };

    static putAPI = async(url, data) => {
        return await AuthAxios.put(process.env.REACT_APP_API_URL + url, data);
    };

    static patchAPI = async(url, data) => {
        return await AuthAxios.patch(process.env.REACT_APP_API_URL + url, data);
    };
}

export {AuthAxios, APIWorker};