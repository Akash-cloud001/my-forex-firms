import { axiosInstance } from "./baseAxios";
import { setupInterceptors } from "./interceptors";

setupInterceptors(axiosInstance);

export default axiosInstance;
