/**
 * API 클라이언트 설정
 * Axios 인스턴스 및 인터셉터 설정
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { config } from "../config";

/**
 * Public API Client (인증 불필요)
 */
export const publicClient = axios.create({
    baseURL: config.apiUrl,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

/**
 * Authenticated API Client (인증 필요)
 */
export const authClient = axios.create({
    baseURL: config.apiUrl,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// 토큰 관리
export const tokenManager = {
    getAccessToken: () => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("accessToken");
    },

    getRefreshToken: () => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("refreshToken");
    },

    setTokens: (accessToken: string, refreshToken: string) => {
        if (typeof window === "undefined") return;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    },

    setAccessToken: (accessToken: string) => {
        if (typeof window === "undefined") return;
        localStorage.setItem("accessToken", accessToken);
    },

    clearTokens: () => {
        if (typeof window === "undefined") return;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    },

    hasTokens: () => {
        if (typeof window === "undefined") return false;
        return !!(
            localStorage.getItem("accessToken") &&
            localStorage.getItem("refreshToken")
        );
    },
};

// Request 인터셉터: Authorization 헤더
authClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenManager.getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response 인터셉터: 토큰 만료 처리
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

authClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return authClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = tokenManager.getRefreshToken();
            if (!refreshToken) {
                tokenManager.clearTokens();
                if (typeof window !== "undefined") {
                    window.location.href = "/auth/login";
                }
                return Promise.reject(error);
            }

            try {
                const response = await publicClient.post("/auth/refresh-token", {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } =
                    response.data.data;
                tokenManager.setTokens(accessToken, newRefreshToken);
                processQueue(null, accessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return authClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenManager.clearTokens();
                if (typeof window !== "undefined") {
                    window.location.href = "/auth/login";
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default { publicClient, authClient, tokenManager };
