import axios from "axios";

const axiosConfig = axios.create({
    baseURL: 'http://127.0.0.1:8001/api',
    // timeout: 5000,
    headers: { 'X-Custom-Header': 'foobar' }
});

axiosConfig.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('actualToken') || null

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    }, function (error) {
    return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
    return response
}, function (error) {
    return Promise.reject(error)
})

export default axiosConfig