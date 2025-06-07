import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_APIENDPOINT || "http://localhost:4500"
export const api = axios.create({
    baseURL: `${API_ENDPOINT}/api`,
    withCredentials: true,
})

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Get the redirect URL from the error response
            const redirectUrl = error.response.data.redirect || '/';
            
            // Redirect to the specified URL
            window.location.href = redirectUrl;
            
            // Return a rejected promise to stop further processing
            return Promise.reject(error);
        }
        
        // For other errors, just return the rejected promise
        return Promise.reject(error);
    }
);