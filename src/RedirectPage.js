import { React, useEffect, useState } from "react";
import logo from "./assets/oftf-logo-white.png";
import background from "./assets/ferns.png";
import "./App.css";

function RedirectPage() {
    const [score, setScore] = useState(0);
    const [calculating, setCalculating] = useState(true);
    useEffect(() => {
        // Get the code from the URL
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
        const scoreRide = async (code) => {
            // Use the code to get the access token
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
            console.log(activitiesData);
            // TODO: Get the activity data
            const activityData = await fetch("https://www.strava.com/api/v3/activities/" + activitiesData[1].id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                },
            });
            const activity = await activityData.json();
            console.log(activity);
            const descents = activity.segment_efforts.filter((segment) => {
                return segment.name.match(/descent|Descent/)
            });
            console.log(descents);
            const score = descents.reduce((total, descent) => {
                let chunk = descent.name.match(/[1-9]|1[0-9]/)[0];
                console.log(chunk);
                return total + parseInt(chunk);
            }, 0);
            console.log(score);
            setScore(score);
            setCalculating(false);
        }
        scoreRide(code);
    }, []);
    return (
        <div className="app-container">
            <div className="background-image">
                {calculating ? (
                    <div className="button-container">
                        <div className="score-label">Calculating Score</div>
                    </div>
                ) : (
                    <div className="button-container">
                        <div className="score">{score}</div>
                        <div className="score-label">Your Score</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RedirectPage;
