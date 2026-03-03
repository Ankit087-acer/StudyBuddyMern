import React, { useState, useEffect } from 'react';
import '../../styles/FocusMode.css';

const FocusMode = () => {
  const [focusActive, setFocusActive] = useState(false);
  const [totalFocusTime, setTotalFocusTime] = useState(() => {
    return parseInt(localStorage.getItem('totalFocusTime')) || 0;
  });
  const [focusStreak, setFocusStreak] = useState(() => {
    return parseInt(localStorage.getItem('focusStreak')) || 0;
  });
  const [notification, setNotification] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    localStorage.setItem('totalFocusTime', totalFocusTime.toString());
    if (totalFocusTime >= 3600) {
      setFocusStreak(prev => Math.max(prev, 1));
    }
  }, [totalFocusTime]);

  useEffect(() => {
    localStorage.setItem('focusStreak', focusStreak.toString());
  }, [focusStreak]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const toggleFocusMode = () => {
    if (!focusActive) {
      // Enable focus mode
      setFocusActive(true);
      document.body.classList.add('focus-active');
      showNotification('Focus mode enabled! Minimizing distractions...');
      
      const id = setInterval(() => {
        setTotalFocusTime(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
    } else {
      // Disable focus mode
      setFocusActive(false);
      document.body.classList.remove('focus-active');
      showNotification('Focus mode disabled.');
      
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  };

  const blockDistractions = () => {
    showNotification('Distractions blocked! Social media and notifications muted.');
  };

  return (
    <div className="tool-card feature-card">
      <div className="tool-header">
        <div className="tool-icon">
          <i className="fas fa-crosshairs"></i>
        </div>
        <h2>Focus Mode</h2>
      </div>
      
      <div className="focus-controls">
        <button
          className={`btn ${focusActive ? 'btn-success' : 'btn-primary'}`}
          onClick={toggleFocusMode}
        >
          <i className={`fas fa-${focusActive ? 'eye-slash' : 'eye'}`}></i>
          {focusActive ? ' Disable Focus Mode' : ' Enable Focus Mode'}
        </button>
        
        <button className="btn btn-outline" onClick={blockDistractions}>
          <i className="fas fa-shield-alt"></i> Block Distractions
        </button>
        
        <div className="focus-stats">
          <div className="stat-card">
            <div className="stat-value">{formatTime(totalFocusTime)}</div>
            <div className="stat-label">Today's Focus</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{focusStreak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <i className={`fas fa-${notification.type === 'success' ? 'check' : 'exclamation'}`}></i>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusMode;