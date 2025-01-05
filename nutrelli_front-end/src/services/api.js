import axios from "axios";
import {error} from "next/dist/build/output/log";

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
});

export default api;