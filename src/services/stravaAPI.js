export async function stravaCall(url, method = "GET", body = null) {
    let accessToken = localStorage.getItem("access_token");
    const queryObject = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
        },
    };
    if (accessToken) {
        queryObject.headers.Authorization = "Bearer " + accessToken;
    }
    if (body) {
        queryObject.body = JSON.stringify(body);
    }
    const data = await fetch(url, queryObject);
    return await data.json();
}

export async function getAccessTokenFromCode(code) {
    const data = await stravaCall(
        "https://www.strava.com/oauth/token",
        "POST",
        {
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
            code: code,
            grant_type: "authorization_code",
        }
    );

    // If there's an error, redirect back to the homepage
    if(data.errors) {
        window.location = "/";
    }

    return data.access_token;
}
