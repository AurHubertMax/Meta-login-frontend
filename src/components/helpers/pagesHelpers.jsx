import { api } from "../../services/api"

export const getFacebookPages = () => {
    return new Promise((resolve, reject) => {
        api.get(`/pages`, {
            withCredentials: true,
        })
        .then(response => {
            logResponse(response, "pages");
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


// export const getFacebookPages = () => {
//     return new Promise((resolve, reject) => {
//         window.FB.getLoginStatus(function(loginResponse) {
//             if (loginResponse.status !== 'connected') {
//                 resolve({
//                     status: "error",
//                     message: "User is not logged in to Facebook.",
//                     error: "User not authenticated"
//                 });
//                 return;
//             }

//             logResponse(loginResponse, "get login status");

//             window.FB.api('/me/accounts', function(pagesResponse) {
//                 logResponse(pagesResponse, "get pages");
//                 if (!pagesResponse || pagesResponse.error) {
//                     resolve({
//                         status: "error",
//                         message: pagesResponse.error.message || "Failed to fetch Facebook pages",
//                         error: pagesResponse.error
//                     });
//                     return;
//                 }

//                 resolve({
//                     status: "success",
//                     message: "Fetched Facebook pages successfully.",
//                     pages: pagesResponse.data
//                 })
//             })

//         })
//     })
// }

export const postToFacebookPage = (pageId, message) => {
    
}

function logResponse(response, text) {
    console.log(`FB ${text} response:`, response);
}