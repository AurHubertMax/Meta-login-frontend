import React, { useEffect } from 'react';
import '../styles/home.css';
import { toast } from 'react-toastify';
import { loadFacebookSDK, handleFacebookLogin } from '../components/helpers/loginHelpers';

const HomePage = () => {
  useEffect(() => {
    const initializeFacebookSDK = async () => {
      try {
        await loadFacebookSDK();
        console.log('Facebook SDK loaded successfully');
      } catch (error) {
        console.error('Error loading Facebook SDK:', error);
      }
    };

    initializeFacebookSDK();
  }, []);

  const handleLoginButtonClick = async () => {
    const response = await handleFacebookLogin();

    if (response.status === 'success') {
      toast.success('Logged in successfully!');
    } else if (response.status === 'error') {
      toast.error(response.message);
    }
  };

  return (
    <div className="home-page">
      <header className="hero">
        <h1>Welcome to Our Application</h1>
        <p>Connection Status: </p>
        <button 
          className="cta-button"
          onClick={handleLoginButtonClick}
        >
          Log in with Facebook
        </button>
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