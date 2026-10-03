import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://loomly-production.up.railway.app/api/v1",
  withCredentials: true,
});

export default axiosInstance;
