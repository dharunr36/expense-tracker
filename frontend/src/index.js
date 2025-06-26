import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div className="app-container" style={{margin:'0px',padding:'0px'}}>
    <ToastContainer />
    <App />
  </div>
);
