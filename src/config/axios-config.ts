import { getAccessToken } from "@/lib/utils";
import { CreateAxiosDefaults, InternalAxiosRequestConfig } from "axios";
import envConfig from "./config";


export const ROOT_API: CreateAxiosDefaults = {
    baseURL: envConfig.NEXT_PUBLIC_API_ENDPOINT,
}

export const authRequestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

