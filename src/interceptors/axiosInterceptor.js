import axios from "axios"

export const AxiosInterceptor = () => {
    axios.interceptors.request.use(
        response => response,
        error => {
            // console.log("botar session desde el context")
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use((response) => {
        // console.log("Entregando respuesta", response);
        return response;
    })
}