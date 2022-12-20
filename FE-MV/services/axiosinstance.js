import axios from "axios";

const axiosInstance = axios.create({ baseURL: "http://localhost:2105"});

export default axiosInstance;