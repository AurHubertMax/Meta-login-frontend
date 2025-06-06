import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import { toast } from 'react-toastify';
// import { loadFacebookSDK, handleFacebookLogin } from '../components/helpers/loginHelpers';
const loginHelper = require('../components/helpers/loginHelpers');

const HomePage = () => {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [tokenInfo, setTokenInfo] = useState({
    status: null,
    message: null,
    userId: null,
    timestamp: null,
    expiresIn: null
  });

  useEffect(() => {
    const initializeFacebookSDK = async () => {
      try {
        await loginHelper.loadFacebookSDK();
        console.log('Facebook SDK loaded successfully');

        const loginStatus = await loginHelper.checkFacebookLoginStatus();
        console.log('Login status:', loginStatus);

        if (loginStatus.status === 'connected') {
          setConnectionStatus('Connected');
          console.log('accessToken:', loginStatus.authResponse.accessToken);
          setTokenInfo({
            status: loginStatus.status,
            message: loginStatus.message,
            userId: loginStatus.authResponse.userID,
            timestamp: new Date().toISOString(),
            expiresIn: loginStatus.authResponse.expiresIn
          });
        }
      } catch (error) {
        console.error('Error loading Facebook SDK:', error);
      }
    };
    initializeFacebookSDK();
    
  }, []);

  const handleLoginButtonClick = async () => {
    const response = await loginHelper.handleFacebookLogin();

    if (response.status === 'success') {
      toast.success('Logged in successfully!');
      setConnectionStatus('Connected');
      setTokenInfo({
        status: response.data.status,
        message: response.data.message,
        userId: response.data.userId,
        timestamp: response.data.timestamp,
        expiresIn: response.data.expiresIn
      });
    } else if (response.status === 'error') {
      toast.error(response.message);
    }
  };

  const handleLogoutButtonClick = async () => {
    const response = await loginHelper.handleFacebookLogout();
    console.log('Logout response:', response);
    if (response.status === 'success') {
      toast.success('Logged out successfully!');
      setConnectionStatus('Disconnected');
      setTokenInfo({
        status: null,
        message: null,
        userId: null,
        timestamp: null,
        expiresIn: null
      });
    } else if (response.status === 'error') {
      toast.error(response.message);
    }
  };

  const toggleDetails = () => {
    setDetailsExpanded(prev => !prev);
  }

  return (
    <div className="home-page">
      <header className="header-container">
        <h1>Welcome to My React App</h1>
        
        <div className="status-panel">
          <div className="status-header" onClick={toggleDetails}>
            <div className="status-indicator">
              <div className={`status-dot ${connectionStatus === 'Connected' ? 'connected' : 'disconnected'}`}></div>
              <span className="status-text">{connectionStatus}</span>
            </div>
            {connectionStatus === 'Connected' && (
              <button className="toggle-details">
                {detailsExpanded ? '▲ Hide Details' : '▼ Show Details'}
              </button>
            )}
          </div>
          
          {connectionStatus === 'Connected' && detailsExpanded && (
            <div className="status-details">
              <div className="detail-item">
                <span className="detail-label">User ID:</span>
                <span className="detail-value">{tokenInfo.userId || 'Unknown'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Connected At:</span>
                <span className="detail-value">
                  {tokenInfo.timestamp ? new Date(tokenInfo.timestamp).toLocaleString() : 'Unknown'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Expires In:</span>
                <span className="detail-value">
                  {tokenInfo.expiresIn ? `${Math.floor(tokenInfo.expiresIn / 3600)} hours` : 'Unknown'}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="auth-buttons-container">
          <button 
            className="cta-button"
            onClick={handleLoginButtonClick}
            disabled={connectionStatus === 'Connected'}
          >
            {connectionStatus === 'Connected' ? 'Connected' : 'Connect with Facebook'}
          </button>
          {connectionStatus === 'Connected' && (
            <button 
              className="cta-button"
              onClick={handleLogoutButtonClick}
            >
              Disconnect
            </button>
          )}
        </div>
        
      </header>
      
      <section className="features">
        <div className="feature">
          <h2>Facebook</h2>
          <p>Connect your Meta account in just a few clicks.</p>
        </div>
        <div className="feature">
          <h2>Instagram</h2>
          <p>Your data is always protected with our secure authentication.</p>
        </div>
        <div className="feature">
          <h2>Threads</h2>
          <p>Enjoy a consistent experience across all your devices.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;