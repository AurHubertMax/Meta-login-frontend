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

export const loadFacebookSDK = () => {
    return new Promise((resolve, reject) => {
        if (window.FB) {
            resolve(window.FB);
            return;
        }

        const script = document.createElement('script');
        script.src = "https://connect.facebook.net/en_US/sdk.js";
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";
        script.onload = () => {
            window.fbAsyncInit = function fbAsyncInit() {
                window.FB.init({
                    appId: process.env.REACT_APP_FACEBOOK_APP_ID,
                    cookie: true,
                    xfbml: true,
                    version: 'v12.0' // Use the latest version available
                });
                resolve(window.FB);
            };
        };
        script.onerror = error => {
            reject(error);
        };
        document.head.appendChild(script);
    })
}

export const handleFacebookLogin = () => {
    return new Promise((resolve, reject) => {
        window.FB.login(
            response => {
                if (response.authResponse) {
                    axios.post(`${API_ENDPOINT}/api/auth/facebook/callback`, {
                        data: response.authResponse
                    })
                    .then(callbackResponse => {
                        resolve(callbackResponse.data);
                    })
                    .catch(error => {
                        resolve({
                            status: "error",
                            message: error.response?.data?.message || "An error occurred during login."
                        })
                    });
                    
                } else {
                    resolve({
                        status: "error",
                        message: "User cancelled login or did not fully authorize."
                    });
                }
            },
            {
                scope: 'public_profile,email,pages_show_list,pages_manage_posts,instagram_basic,instagram_content_publish',
                auth_type: 'rerequest'
            },
        );
    })
    
}

export const checkFacebookLoginStatus = () => {
    return new Promise((resolve, reject) => {
        // TODO: implement FB SDK checkLoginStatus

        axios.get(`${API_ENDPOINT}/api/auth/facebook/status`)
        .then(callbackResponse => {
            resolve(callbackResponse.data);
        })
        .catch(error => {
            resolve({
                status: "error",
                message: error.response?.data?.message || "An error occurred during login."
            })
        });
    })
}

export const handleFacebookLogout = () => {
    return new Promise((resolve, reject) => {
        window.FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                window.FB.logout(() => {
                    clearBackendSession(resolve);
                });
            } else {
                clearBackendSession(resolve);
            }
        });
    });
};

// Helper function to clear backend session
const clearBackendSession = (resolve) => {
    axios.post(`${API_ENDPOINT}/api/auth/facebook/disconnect`)
        .then(callbackResponse => {
            if (callbackResponse.data.status === "success") {
                resolve({
                    status: "success",
                    message: "Logged out successfully."
                });
            } else {
                resolve({
                    status: "error",
                    message: callbackResponse.data.message || "Failed to clear session on backend."
                });
            }
            
        })
        .catch(error => {
            console.warn("Backend logout failed:", error);
            resolve({
                status: "error",
                message: "Failed to clear session on backend."
            });
        });
};