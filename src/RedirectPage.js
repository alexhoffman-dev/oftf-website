import { React, useEffect, useState } from "react";
import "./App.css";
import { stravaCall, getAccessTokenFromCode } from "./services/stravaAPI.js";

function RedirectPage() {
    const [score, setScore] = useState(0);
    const [calculating, setCalculating] = useState(true);
    useEffect(() => {
        // Get the code from the URL
        // NOTE! This is dangerous and error prone.
        let code = null;
        let urlStuff = window.location.href.split("&");
        if (urlStuff.length > 1) {
            code = urlStuff.find((chunk) => {
                return chunk.includes("code");
            });
            if (code) {
                code = code.split("=")[1];
            }
        }

        // If there is no code, redirect to the home page
        if (!code) {
            window.location = "/";
        }

        const scoreRide = async (code) => {
            // Use the code to get the access token
            const accessToken = await getAccessTokenFromCode(code);

            // Store the access token in local storage
            localStorage.setItem("access_token", accessToken);

            // Get the user's activities
            // NOTE! Ideally we would limit this to only get the most recent activity.
            const activitiesList = await stravaCall(
                "https://www.strava.com/api/v3/athlete/activities?per_page=3"
            );

            // Get the first activity result (should be the firelane ride, doomed if not)
            const activity = await stravaCall(
                `https://www.strava.com/api/v3/activities/${activitiesList[1].id}`
            );
            
            // Get the segments from the activity that are descents
            const descents = activity.segment_efforts.filter((segment) => {
                return segment.name.match(/descent|Descent/)
            });
            
            // Pull numbers out of the segment names and add them up
            const score = descents.reduce((total, segment) => {
                // Right now this only works up to the number 19
                let chunk = segment.name.match(/[1-9]|1[0-9]/)[0];
                return total + parseInt(chunk);
            }, 0);
            
            // Set the score and stop calculating
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
