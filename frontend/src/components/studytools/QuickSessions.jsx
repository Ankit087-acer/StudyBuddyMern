import React from 'react';
import '../../styles/QuickSessions.css';

const QuickSessions = () => {
  const sessions = [
    { minutes: 25, icon: 'fa-bolt', label: '25min Focus', type: 'primary' },
    { minutes: 45, icon: 'fa-gem', label: '45min Deep Work', type: 'primary' },
    { minutes: 15, icon: 'fa-running', label: '15min Review', type: 'outline' },
    { minutes: 60, icon: 'fa-mountain', label: '1hr Marathon', type: 'outline' }
  ];

  const showNotification = (message) => {
    // This would be connected to a global notification system
    alert(message);
  };

  const startSession = (minutes) => {
    showNotification(`Started ${minutes}-minute focus session!`);
  };

  return (
    <div className="tool-card feature-card">
      <div className="tool-header">
        <div className="tool-icon">
          <i className="fas fa-rocket"></i>
        </div>
        <h2>Quick Sessions</h2>
      </div>
      
      <div className="session-buttons">
        {sessions.map((session, index) => (
          <button
            key={index}
            className={`session-btn ${session.type === 'primary' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => startSession(session.minutes)}
          >
            <i className={`fas ${session.icon}`}></i>
            <span>{session.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSessions;