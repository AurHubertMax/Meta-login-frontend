import { api } from "../../services/api"

export const getFacebookPages = () => {
    return new Promise((resolve, reject) => {
        api.get(`/pages`)
        .then(response => {
            logResponse(response.data, "pages");
            resolve(response.data);
        })
        .catch(error => {
            resolve({
                status: "error",
                message: error.response?.data?.message || "An error occurred while fetching Facebook pages."
            });
        })
    })
}

export const postToFacebookPage = (pageId, message) => {
    
}

function logResponse(response, text) {
    console.log(`FB ${text} response:`, response);
}