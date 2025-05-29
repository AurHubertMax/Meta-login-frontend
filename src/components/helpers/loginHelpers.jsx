import axios from "axios"

const API_ENDPOINT = process.env.REACT_APP_APIENDPOINT || "http://localhost:4500"

export const checkBackend = async () => {
    try {
        const response = await axios.get(`${API_ENDPOINT}/api/health`, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        return{ 
            status: "success", 
            message: "Backend is reachable",
            data: response.data 
        }
    } catch (error) {
        console.error("Error checking backend:", error)
        return{ 
            status: "error", 
            message: "Backend is not reachable",
            error: error.message
        }
    }
}