import { React, useEffect, useState } from "react";
import logo from "./assets/oftf-logo-white.png";
import background from "./assets/ferns.png";

function RedirectPage() {
    useEffect(() => {
        // TODO: Get the code from the URL
        let code = null;
        let urlStuff = window.location.href.split("&");
        if (urlStuff.length > 1) {
            code = urlStuff.find((chunk) => {
                return chunk.includes("code");
            });
            if (code) {
                code = code.split("=")[1];
                console.log(code);
            }
        }
        // TODO: Use the code to get the access token
        const tokenStuff = async (code) => {
            console.log(process.env.REACT_APP_CLIENT_ID);
            console.log(process.env.REACT_APP_CLIENT_SECRET);
            console.log(code);
            const accessCredentials = await fetch('https://www.strava.com/oauth/token', {
                method: 'POST',
                body: JSON.stringify({
                    client_id: process.env.REACT_APP_CLIENT_ID,
                    client_secret: process.env.REACT_APP_CLIENT_SECRET,
                    code: code,
                    grant_type: 'authorization_code'
                }),
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                }
            });
            const credentials = await accessCredentials.json();
            console.log(credentials);
            let accessToken = credentials.access_token;
            console.log(accessToken);
            const activities = await fetch(
                "https://www.strava.com/api/v3/athlete/activities?per_page=3",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                }
            );
            const activitiesData = await activities.json();
            console.log('wadduuuup');
            console.log(activitiesData);
        }
        tokenStuff(code);
        // TODO: Use the access token to get the user's activities
        // TODO: Use the activities to calculate the score
    }, []);
    return (
        <div className="app-container">
            
            <div className="button-container">
                <div>Calculating your score</div>
            </div>
        </div>
    );
}

export default RedirectPage;
