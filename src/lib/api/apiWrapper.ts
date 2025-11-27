import axiosInstance from "@/lib/axios";

export const apiGet = <T>(url: string, params?: unknown): Promise<T> =>
    axiosInstance.get(url, { params });

export const apiPost = <T>(url: string, body?: unknown): Promise<T> =>
    axiosInstance.post(url, body);

export const apiPatch = <T>(url: string, body?: unknown): Promise<T> =>
    axiosInstance.patch(url, body);

export const apiDelete = <T>(url: string): Promise<T> =>
    axiosInstance.delete(url);
