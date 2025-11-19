import axios from "axios"

const api = axios.create({
    baseURL: 'http://localhost:4000'
})

// ------------------
// STATE VARIABLES
// ------------------
let isRefreshing = false;
let failedQueue = [];

// ------------------
// PROCESS QUEUE
// ------------------
function processQueue(error, token = null) {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });

    failedQueue = []; // empty queue
}

// ------------------
// REQUEST INTERCEPTOR
// ------------------
api.interceptors.request.use((config) => {
    const accessToken = sessionStorage.getItem('accessToken')
    if (accessToken) {
        config.headers.accesstoken = accessToken
    }

    return config
})

// ------------------
// RESPONSE INTERCEPTOR
// ------------------
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

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

                const newAccess = result.data.accessToken;

                sessionStorage.setItem("accessToken", newAccess);

                api.defaults.headers["accesstoken"] = newAccess;

                // Retry all queued requests
                processQueue(null, newAccess);

                // Finish refreshing
                isRefreshing = false;

                // Retry the original request
                originalRequest.headers["accesstoken"] = newAccess;
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                isRefreshing = false;
                return Promise.reject(err);
            }
        }

        // Not 401
        return Promise.reject(error);
    }
);

export default api
