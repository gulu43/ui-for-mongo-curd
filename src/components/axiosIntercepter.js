import axios from "axios"
import { config } from "dotenv"

const api = axios.create({
    baseURL: 'http://localhost:4000'
})

api.interceptors.request.use((config) => {
    const accesToken = sessionStorage.getItem('accessToken')
    if (accesToken) {
        config.headers.accestoken = accesToken

    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {

        const originalResponse = error.config

        if (error.response.status == 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const result = await axios.post('http://localhost:4000/refresh', {}, {
                headers: { 'refreshToken': refreshToken }
            })

            sessionStorage.setItem('accesToken', result.data.refreshtoken)
            originalResponse.headers.accestoken = result.data.refreshtoken

            // api({
            //     method: originalRequest.method,
            //     url: originalRequest.url,
            //     data: originalRequest.data,
            //     headers: originalRequest.headers,
            // })

            return api(originalResponse)

        }


        return Promise.reject(error);
        // what if 
        // return error; 
        // React receives this as success, not error.
        // So code becomes: const res = error  // invalid
    }

)

export default api
