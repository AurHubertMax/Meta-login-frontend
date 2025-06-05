import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import { toast } from 'react-toastify';
// import { loadFacebookSDK, handleFacebookLogin } from '../components/helpers/loginHelpers';
const loginHelper = require('../components/helpers/loginHelpers');
const pagesHelper = require('../components/helpers/pagesHelpers');

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
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const initializeFacebookSDK = async () => {
      try {
        await loginHelper.loadFacebookSDK();
        console.log('Facebook SDK loaded successfully');

        const loginStatus = await loginHelper.getFacebookAuthStatus();
        console.log('Login status:', loginStatus);

        if (loginStatus.status === 'success' && loginStatus.data.status === 'connected') {
          setConnectionStatus('Connected');
          // console.log('accessToken:', loginStatus.authResponse.accessToken);
          setTokenInfo({
            status: loginStatus.data.status,
            message: loginStatus.data.message,
            userId: loginStatus.data.userId,
            timestamp: new Date().toISOString(),
            expiresIn: new Date(loginStatus.data.tokenExpiresAt).getTime() - new Date().getTime()
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

  const handleGetPages = async () => {
    console.log('Fetching Facebook pages...');
    const response = await pagesHelper.getFacebookPages();
    if (response.status === 'success') {
      setPages(response.data);
      toast.success('Fetched Facebook pages successfully!');
      console.log('Facebook Pages:', pages);
    } else {
      toast.error(response.message);
    }
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
                  {
                    tokenInfo.expiresIn ? 
                      (() => {
                        const days = Math.floor(tokenInfo.expiresIn / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((tokenInfo.expiresIn % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((tokenInfo.expiresIn % (1000 * 60 * 60)) / (1000 * 60));
                        
                        if (days > 0) {
                          return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
                        } else if (hours > 0) {
                          return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
                        } else {
                          return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
                        }
                      })() : 
                      'Unknown'
                  }
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

      <button 
        className='cta-button'
        onClick={handleGetPages}
      >
        Get Facebook Pages
      </button>
    </div>
  );
};

export default HomePage;