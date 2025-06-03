import axios from "axios"

const API_ENDPOINT = process.env.REACT_APP_APIENDPOINT || "http://localhost:4500"

export const getFacebookPages = () => {
    return new Promise((resolve, reject) => {
        window.FB.getLoginStatus(function(loginResponse) {
            if (loginResponse.status !== 'connected') {
                resolve({
                    status: "error",
                    message: "User is not logged in to Facebook.",
                    error: "User not authenticated"
                })
                return;
            }
            console.log("FB login response:", loginResponse);
            window.FB.api(`/me/accounts`, {
                accessToken: loginResponse.authResponse.accessToken,
            }, (pagesResponse) => {

                if (pagesResponse && pagesResponse.error) {
                    console.error('Facebook Pages API error:', pagesResponse.error);
                    resolve({
                        status: "error",
                        message: pagesResponse.error.message || "Failed to fetch Facebook pages",
                        error: pagesResponse.error
                    });
                    return;
                }
                
                console.log("Facebook Pages Response:", pagesResponse)
                resolve({
                    status: "success",
                    message: "Fetched Facebook pages successfully.",
                    pages: pagesResponse.data
                })
            })
        })
        
    })
}