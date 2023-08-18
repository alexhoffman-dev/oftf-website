import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import RedirectPage from './RedirectPage';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <div className="main">
            <Routes>
                <Route index element={<App/>}/>
                <Route path="/redirect/*" element={<RedirectPage/>} />
            </Routes>
        </div>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
