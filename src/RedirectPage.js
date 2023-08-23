import { React, useEffect, useState } from "react";
import "./App.css";
import { stravaCall, getAccessTokenFromCode } from "./services/stravaAPI.js";

// const SCORIsdfNG_RUBRIC = {
//     // 9525104: 2,
//     // 3700363: 5,
//     // 1767027: 5,
//     // 9525093: 6.66,
//     // 1388529: 7,
//     // 9454289: 10,
//     // 9767475: 11,
// };

const SCORING_RUBRIC = [
    {
        ids: ["9767475"],
        score: 11,
        name: "Firelane 1 (Complete)",
        requirement: "one",
    },
    {
        ids: ['1303836'],
        score: 1,
        name: "Firelane 1 (top)",
        requirement: "one",
    },
    {
        ids: ['1303836'],
        score: 1,
        name: "Firelane 1 (bottom)",
        requirement: "one",
    },
    {
        ids: ["9454289"],
        score: 10,
        name: "Firelane 10",
        requirement: "one",
    },
    {
        ids: ["1388529"],
        score: 7,
        name: "Firelane 7",
        requirement: "one",
    },
    {
        ids: ["9525093"],
        score: 6.66,
        name: "Firelane 666",
        requirement: "one",
    },
    {
        ids: ["3700363", "1767027", "1781143"],
        score: 5,
        name: "Firelane 5",
        requirement: "one",
    },
    {
        ids: ["9525104"],
        score: 2,
        name: "Firelane 2",
        requirement: "one",
    },
    {
        ids: ['9454289', '29212760'],
        score: 10,
        name: 'Firelane 10',
        requirement: "all"
    }, 
    {
        ids: ['35250499'],
        //27464716 = id for 12 climb
        score: 12,
        name: 'Firelane 12',
        requirement: "one",
        eliminates: "Firelane 12 lower"
    },
    {
        ids: ['5161726', '27464716'],
        score: 12,
        name: 'Firelane 12 lower',
        requirement: "all"

    },
    {
        ids: ['1716206'],
        score: 15,
        name: 'Firelane 15',
        requirement: "one",
    }
];


// User bring big list of segments
// We have rubric
// 

function RedirectPage() {
    const [completedLanes, setCompletedLanes] = useState([]);
    const [score, setScore] = useState(0);
    const [calculating, setCalculating] = useState(true);
    // Scoring Rubric has the following key
    // segment ID : points worth 
    // const scoringRubric = {
    //     '9767475' : 11,
    //     '9525104' : 2,
    //     '9525093' : 6.66,
    //     '3700363' : 5, 
    //     '1767027' : 5,
    //     '1388529' : 7,
    //     '9454289' & '29212760': 10, 
    //     '1716206' & '5161726': 27,
    //     '1583715' : 1 | '1303836' : 1


    // }

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
                "https://www.strava.com/api/v3/athlete/activities?per_page=4"
            );
            
            // Get the first activity result (should be the firelane ride, doomed if not)
            const activity = await stravaCall(
                `https://www.strava.com/api/v3/activities/${activitiesList[3].id}`
            );
            const listOfSegmentIDs = [];
            activity.segment_efforts.forEach((segment) => {
                listOfSegmentIDs.push(segment.segment.id);
            });
            console.log(listOfSegmentIDs);
            
            let newScore = 0;
            const eliminatedRoutes = [];
            const lanesList = [];
            SCORING_RUBRIC.forEach((segment) => {
                if (eliminatedRoutes.includes(segment.name)) {
                    return;
                }
                if (segment.requirement === "one") {
                    if (segment.ids.some((id) => listOfSegmentIDs.includes(parseInt(id)))) {
                        newScore += segment.score;
                        lanesList.push(segment.name);
                    }
                } else if (segment.requirement === "all") {
                    if (segment.ids.every((id) => listOfSegmentIDs.includes(id))) {
                        newScore += segment.score;
                        lanesList.push(segment.name);
                        if (segment.eliminates) {
                            eliminatedRoutes.push(...segment.eliminates);
                        }
                    }
                }
            });
            
            // Set the score and stop calculating
            // setScore(score);
            setCompletedLanes(lanesList);
            setScore(newScore);
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
                        <div className='completed-lanes-title'>ur lanes</div>
                        {
                            completedLanes.map((lane) => {
                                return <div className='completed-lanes'>{lane}</div>
                            })
                        }
                        <div className="score">{score}</div>
                        <div className="score-label">Your Score</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RedirectPage;
