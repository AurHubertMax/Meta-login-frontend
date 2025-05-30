import React from 'react';
import '../styles/home.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="hero">
        <h1>Welcome to Our Application</h1>
        <p>Connection Status: </p>
        <button className="cta-button">Log in with Facebook</button>
      </header>
      
      <section className="features">
        <div className="feature">
          <h2>Easy Integration</h2>
          <p>Connect your Meta account in just a few clicks.</p>
        </div>
        <div className="feature">
          <h2>Secure Login</h2>
          <p>Your data is always protected with our secure authentication.</p>
        </div>
        <div className="feature">
          <h2>Seamless Experience</h2>
          <p>Enjoy a consistent experience across all your devices.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;