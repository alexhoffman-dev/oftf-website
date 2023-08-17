import React from 'react';
import './App.css';
import logo from './assets/oftf-logo-white.png'
import background from './assets/ferns.png'


function App() {
  return (
    <div className="app-container">
      <div className="background-image">
        <img src={ background } alt="Background" />
      </div>
      <div className="logo-container">
        <img src={ logo } alt="Logo" className="logo" />
      </div>
      <div className="button-container">
        <button className="score-button">SCORE MY RIDE</button>
      </div>
    </div>
  );
}

export default App;
