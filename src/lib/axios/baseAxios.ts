import axios, { AxiosInstance } from "axios";

const getBaseURL = (): string => {
    const url = process.env.NEXT_PUBLIC_API_URL;

    if (!url) return "/api";
    if (url === "/api") return "/api";
    if (url.startsWith("http")) return url;

    return "/api";
};

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: getBaseURL(),
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
    },
});
