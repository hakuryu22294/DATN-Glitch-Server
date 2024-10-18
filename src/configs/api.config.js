import axios from "axios";

const instanceApi = axios.create({
  baseURL: "https://datn-glitch-server-1.onrender.com/api/v1",
  withCredentials: true,
});

export default instanceApi;
