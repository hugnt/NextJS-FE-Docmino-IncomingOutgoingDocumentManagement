/* eslint-disable @typescript-eslint/no-explicit-any */
import { PATH } from "@/constants/paths";
import { Result } from "@/types/api";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getRefreshToken, handleErrorApi, isLoginPage, removeClientToken, setClientToken } from "./utils";
import { authRequestInterceptor, ROOT_API } from "@/config/axios-config";
import authApiRequest from "@/api/authApiRequest";


let isRefreshing = false;
let refreshTokenPromise: Promise<string | undefined> | null = null;

const axiosInstance = axios.create(ROOT_API);
const axiosRetry = axios.create(ROOT_API);

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retryCount?: number;
}
// Interceptor request
axiosInstance.interceptors.request.use(authRequestInterceptor)
axiosRetry.interceptors.request.use(authRequestInterceptor)

axiosRetry.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error("Refresh request failed:", error.message);
        return Promise.reject(error);
    }
);
// Interceptor response
axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error: AxiosError<Result<any>>) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        // const requestKey = `${originalRequest.method}:${originalRequest.url}`;
        // originalRequest._retryCount = originalRequest._retryCount || 0;
        if (!isLoginPage() && error.response && error.response.status === 401) {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                removeClientToken();
                window.location.href = PATH.Login;
                return Promise.reject(error);
            }
            if (!isRefreshing) {
                isRefreshing = true;
                refreshTokenPromise = authApiRequest.extendSession({ refreshToken })
                    .then((res) => {
                        const newAccessToken = res.data!.accessToken;
                        const newRefreshToken = res.data!.refreshToken;
                        setClientToken({ accessToken: newAccessToken, refreshToken: newRefreshToken });
                        console.log("RETRY Original SUCCESS")
                        return newAccessToken;
                    })
                    .catch((err) => {
                        console.log("RETRY TOKEN FAILURE")
                        removeClientToken();
                        window.location.href = PATH.Login;
                        throw err;
                    })
                    .finally(() => {
                        isRefreshing = false;
                        refreshTokenPromise = null;
                    });
            }
            try {
                const newAccessToken = await refreshTokenPromise!;
                if (originalRequest.headers)
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.log("RETRY THEN FAILURE")
                return Promise.reject(err);
            }
        }
        else {
            handleErrorApi({ errors: error.response?.data?.errors || [error.message] });
        }
        return Promise.reject(error);
    }
);

export const httpClient = {
    get: <T>(url: string, config?: AxiosRequestConfig<any>): Promise<Result<T>> =>
        axiosInstance.get<any, Result<T>>(url, config),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<Result<T>> =>
        axiosInstance.post<any, Result<T>>(url, data, config),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<Result<T>> =>
        axiosInstance.put<any, Result<T>>(url, data, config),

    delete: <T>(url: string, config?: AxiosRequestConfig<any>): Promise<Result<T>> =>
        axiosInstance.delete<any, Result<T>>(url, config),

    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<Result<T>> =>
        axiosInstance.patch<any, Result<T>>(url, data, config),
};

export const httpClientRetry = {
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<Result<T>> =>
        axiosRetry.post<any, Result<T>>(url, data, config),
};
