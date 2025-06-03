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
                    console.log("FB login response:", response);
                    testAPI(); // Optional: Call testAPI to fetch user info
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
                scope: 'public_profile,email,pages_show_list,pages_manage_posts,instagram_basic,instagram_content_publish,business_management',
                auth_type: 'rerequest'
            },
        );
    })
    
}

export const checkFacebookLoginStatus = () => {
    return new Promise((resolve, reject) => {
        window.FB.getLoginStatus(function(response) {
            console.log("FB login status response:", response);
            if (response.status === 'connected') {
                testAPI(); // Optional: Call testAPI to fetch user info
                resolve({
                    status: "connected",
                    message: "User is already logged in.",
                    authResponse: response.authResponse
                });
            }
            if (response.status === 'not_authorized') {
                resolve({
                    status: "not_authorized",
                    message: "User is logged in to Facebook but have not authorized the app.",
                    authResponse: response.authResponse
                });
            }
            if (response.status === 'unknown') {
                resolve({
                    status: "unknown",
                    message: "User is not logged in to Facebook.",
                    authResponse: null
                });
            }
        })
    })
}

export const handleFacebookLogout = () => {
    return new Promise((resolve, reject) => {
        window.FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                window.FB.logout((response) => {
                    console.log("FB logout response:", response);
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

function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    window.FB.api('/me', function(meResponse) {
        console.log('Successful login for: ' + meResponse.name);
    });
    window.FB.api('/me/accounts', function(pagesResponse) {
        console.log('Pages:', pagesResponse);
        if (pagesResponse && pagesResponse.data && pagesResponse.data.length > 0) {
            pagesResponse.data.forEach(page => {
                console.log('checking instagram account for page:', page.name);

                window.FB.api(`/${page.id}?fields=instagram_business_account`, 
                    {
                        accessToken: page.access_token
                    },
                    function(instagramResponse) {
                        if (instagramResponse && instagramResponse.instagram_business_account) {
                            console.log(`Instagram account for page ${page.name}:`, instagramResponse.instagram_business_account);
                            window.FB.api(
                                `/${instagramResponse.instagram_business_account.id}?fields=username,profile_picture_url,name`,
                                { access_token: page.access_token },
                                function(instaDetailsResponse) {
                                    console.log(`Instagram account details:`, instaDetailsResponse);
                                }
                            );
                        } else {
                            console.log(`No Instagram account linked for page ${page.name}`);
                        }
                    }
                );
            })
        }

    });
    window.FB.api('/me/businesses', function(businessesResponse) {
        console.log('Businesses:', businessesResponse);
    });
    
}