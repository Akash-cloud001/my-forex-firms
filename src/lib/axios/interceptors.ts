import { AxiosInstance, AxiosResponse, AxiosError } from "axios";

export interface ApiError {
    message: string;
    status?: number;
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
            const err: ApiError = {
                message:
                    (error.response?.data as any)?.message ||
                    (error.response?.data as any)?.error ||
                    error.message ||
                    "Unknown error",
                status: error.response?.status,
            };

            return Promise.reject(err);
        }
    );
};
