import React from "react";
import "./Landing.css"; // Optional: for external styling
import { Link } from 'react-router-dom';

import Header from "./Pages/Tran/Header";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'; 
import Footer from "./Pages/Tran/Footer";

function Hero() {
  return (
    <>
    <section className="hero" aria-label="Hero section with expense tracking info">
      <div className="hero-text">
        <h1>Track your expenses <br/>and stay on top of your</h1>
        
        <p className="hero-des">
          Effortlessly manage expenses with our intuitive interface, ensuring
          financial stability.Effortlessly manage expenses with our intuitive interface, ensuring financial stability.Effortlessly manage expenses with our intuitive interface, ensuring financial stability.Effortlessly manage expenses with our intuitive interface, ensuring financial stability.Effortlessly manage expenses with our intuitive interface, ensuring financial stability.
        </p>
        <br /><br />
        <div className="hero-buttons">
          <button type="button" aria-label="Explore now">Explore now</button>
          <button type="button" aria-label="Try it out"><Link to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Get Started
                      </Link></button>
        </div>
      </div>
      <div className="hero-icon" aria-hidden="true">
        <svg
          role="img"
          focusable="false"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          ><path 
          d="M32 2C15.458 2 2 15.458 2 32s13.458 30 30 30 30-13.458 30-30S48.542 2 32 2zm0 8a22 22 0 0122 22h-22V10zm0 44a22 22 0 01-22-22h22v22zm4-22h18a22 22 0 01-18 18v-18zm0-4V10a22 22 0 0118 18h-18z" 
          fill="white"
        />

        
        </svg>




      </div>
    </section>
    <br /><br /><br /><br /><br /><br /><br /><br /><br /></>
  );
}


function Landing() {
  return (
    <div>
      <Header />
      <Hero />
     
      <Footer/>
    </div>
  );
}

export default Landing;
