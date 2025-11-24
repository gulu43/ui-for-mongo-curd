import axios from "axios"
import { goToLogin, updateAccessTokenInIntercepter } from "./redirect.js"

const api = axios.create({
    baseURL: 'http://localhost:4000'
})

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });

    failedQueue = [];
}

api.interceptors.request.use((config) => {
    const accessToken = sessionStorage.getItem('accessToken')
    console.log('what i am sending', accessToken);

    if (accessToken) {
        config.headers.accesstoken = accessToken
    }

    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // console.log("response error----------------------------------------------: ", error);

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Already refreshing → queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["accesstoken"] = token;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            // Not refreshing → start refresh
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                const result = await axios.post(
                    "http://localhost:4000/refresh",
                    {},
                    { headers: { refreshtoken: refreshToken } }
                );
                // console.log('axiosIntercepter:--------- ', result);
                const newAccess = result?.data?.accessToken;
                // console.log('newAccess?: ', newAccess);

                api.defaults.headers["accesstoken"] = newAccess;

                updateAccessTokenInIntercepter(newAccess)

                sessionStorage.setItem("accessToken", newAccess);

                // console.log("Before:", sessionStorage.getItem("accessToken"));

                // setTimeout(() => {
                //     console.log("After 100ms:", sessionStorage.getItem("accessToken"));
                // }, 100);

                // setTimeout(() => {
                //     console.log("After 500ms:", sessionStorage.getItem("accessToken"));
                // }, 500);

                // console.log('accesstoken in intercepters: ', sessionStorage.getItem('accessToken'))

                // setTimeout(() => {
                //     // sessionStorage.setItem("accessToken", newAccess);
                //     console.log("After 1sec: ", sessionStorage.getItem("accessToken"));
                // }, 1000);

                // Retry all queued requests
                processQueue(null, newAccess);

                // Finish refreshing
                isRefreshing = false;

                // Retry the original request
                originalRequest.headers["accesstoken"] = newAccess;
                // console.log('original request: ', originalRequest);
                return api(originalRequest);

            } catch (err) {
                processQueue(err, null);
                isRefreshing = false;

                

                console.log("response error: ", err);
                if (err.response.status == 404) {
                    sessionStorage.clear()
                    localStorage.clear()
                    // Guaranteed redirect
                    window.location.href = "/login";
                    return;
                }



                return Promise.reject(err);
                // throw error
            }
        }

        // Not 401
        // console.log('+-------it in refresh error');
        // sessionStorage.clear()
        // localStorage.clear()
        // goToLogin();
        return Promise.reject(error);

    }
);

export default api
