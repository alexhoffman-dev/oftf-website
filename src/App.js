import React from "react";
import "./App.css";
import logo from "./assets/oftf-logo-white.png";
import background from "./assets/ferns.png";

const redirectUrl = "https://ourfatherthefirelane.netlify.app/redirect/";

const handleLogin = () => {
    window.location = `http://www.strava.com/oauth/authorize?client_id=110279&response_type=code&redirect_uri=${redirectUrl}&approval_prompt=force&scope=read,activity:read`;
};

function App() {
    return (
        <div className="app-container">
            <div className="background-image">
                <img src={background} alt="Background" />
            </div>
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className="button-container">
                <button className="score-button" onClick={handleLogin}>
                    SCORE MY RIDE
                </button>
            </div>
        </div>
    );
}

export default App;
