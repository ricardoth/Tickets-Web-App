import axios from "axios"

let sessionExpiredHandled = false;

export const AxiosInterceptor = () => {
    axios.interceptors.request.use(
        request => request,
        error => Promise.reject(error)
    );

    axios.interceptors.response.use(
        response => response,
        error => {
            if (error?.response?.status === 401 && !sessionExpiredHandled) {
                sessionExpiredHandled = true;
                localStorage.removeItem('user');
                localStorage.setItem('sessionExpired', 'true');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
}
