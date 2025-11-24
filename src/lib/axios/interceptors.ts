import { AxiosInstance, AxiosResponse, AxiosError } from "axios";

export interface ApiError {
    message: string;
    status?: number;
}

interface ErrorResponseData {
    message?: string;
    error?: string;
}

export const setupInterceptors = (instance: AxiosInstance): void => {
    // REQUEST
    instance.interceptors.request.use(
        (config) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("token");
                if (token) config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // RESPONSE
    instance.interceptors.response.use(
        (response: AxiosResponse) => response.data,
        (error: AxiosError) => {
            const data = error.response?.data as ErrorResponseData | undefined;
            const err: ApiError = {
                message:
                    data?.message ||
                    data?.error ||
                    error.message ||
                    "Unknown error",
                status: error.response?.status,
            };

            return Promise.reject(err);
        }
    );
};
