import axios from "axios"

const api = axios.create({
    baseURL: 'http://localhost:4000'
})

api.interceptors.request.use((config) => {
    const accessToken = sessionStorage.getItem('accessToken')
    if (accessToken) {
        config.headers.accesstoken = accessToken
    }
    
    return config
})

const refreshToken = localStorage.getItem('refreshToken')
api.interceptors.response.use(
    (response) => response,
    async (error) => {

        const originalRequest = error.config

        if (error.response.status == 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const result = await axios.post('http://localhost:4000/refresh', {}, {
                headers: { 'refreshToken': refreshToken }
            })

            sessionStorage.setItem('accessToken', result.data.accessToken)
            originalRequest.headers.accestoken = result.data.accessToken

            // api({
            //     method: originalRequest.method,
            //     url: originalRequest.url,
            //     data: originalRequest.data,
            //     headers: originalRequest.headers,
            // })

            return api(originalRequest)

        }


        return Promise.reject(error);
        // what if 
        // return error; 
        // React receives this as success, not error.
        // So code becomes: const res = error  // invalid
    }

)

export default api
