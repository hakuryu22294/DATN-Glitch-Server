import axios from "axios";

const instanceApi = axios.create({
  baseURL: "https://datn-glitch-server-1.onrender.com/",
  withCredentials: true,
});

export default instanceApi;
