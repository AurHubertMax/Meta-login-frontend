import { api } from "../../services/api"

export const getThreadsAccount = () => {
    return new Promise((resolve, reject) => {
        api.get('/threads')
        .then(response => {
            console.log("Threads accounts response:", response.data);
            resolve(response.data);
        })
        .catch(error => {
            resolve({
                status: "error",
                message: error.response?.data?.message || "An error occurred while fetching Threads accounts."
            });
        })
    })
}