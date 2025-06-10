import { api } from "../../services/api"

export const getInstagramAccounts = () => {
    return new Promise((resolve, reject) => {
        api.get('/instagram')
        .then(response => {
            console.log("Instagram accounts response:", response.data);
            resolve(response.data);
        })
        .catch(error => {
            resolve({
                status: "error",
                message: error.response?.data?.message || "An error occurred while fetching Instagram accounts."
            });
        })
    })
}