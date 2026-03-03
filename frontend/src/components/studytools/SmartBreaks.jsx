import React, { useState, useRef } from 'react';
import '../../styles/SmartBreaks.css';

const SmartBreaks = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [nextBreak, setNextBreak] = useState('25 minutes');
  const lofiPlayerRef = useRef(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const startBreakActivity = (activity) => {
    showNotification(`Starting ${activity} break activity!`);
  };

  const toggleMusic = () => {
    if (lofiPlayerRef.current) {
      if (!isPlaying) {
        lofiPlayerRef.current.src = "https://www.youtube.com/embed/n61ULEU7CO0?start=0&autoplay=1&loop=1&playlist=n61ULEU7CO0";
        showNotification('Playing relaxing music...');
        setIsPlaying(true);
      } else {
        lofiPlayerRef.current.src = "";
        showNotification('Music stopped');
        setIsPlaying(false);
      }
    }
  };

  const breaks = [
    { icon: 'fa-walking', label: '5min Walk', action: 'walk' },
    { icon: 'fa-eye', label: '20-20-20 Rule', action: 'eye' },
    { icon: 'fa-music', label: isPlaying ? 'Stop Music' : 'Relaxing Music', action: 'music', special: true },
    { icon: 'fa-brain', label: 'Mindfulness', action: 'mindfulness' }
  ];

  return (
    <div className="tool-card feature-card">
      <div className="tool-header">
        <div className="tool-icon">
          <i className="fas fa-coffee"></i>
        </div>
        <h2>Smart Breaks</h2>
      </div>
      
      <div className="break-buttons">
        {breaks.map((breakItem, index) => (
          <button
            key={index}
            className="break-btn btn-outline"
            onClick={breakItem.special ? toggleMusic : () => startBreakActivity(breakItem.action)}
          >
            <i className={`fas ${breakItem.icon}`}></i>
            <span>{breakItem.label}</span>
          </button>
        ))}
      </div>
      
      <div className="break-info">
        <p>Next break in: <strong>{nextBreak}</strong></p>
      </div>

      {/* Hidden iframe for lofi music */}
      <iframe
        ref={lofiPlayerRef}
        id="lofi-player"
        width="0"
        height="0"
        frameBorder="0"
        allow="autoplay"
        allowFullScreen
        title="lofi music"
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      />

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

export default SmartBreaks;