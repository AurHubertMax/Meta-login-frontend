import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_APIENDPOINT || "http://localhost:4500"
export const api = axios.create({
    baseURL: `${API_ENDPOINT}/api`,
    withCredentials: true,
})