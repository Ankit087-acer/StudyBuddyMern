import React from 'react';
import '../../styles/StudyAnalytics.css';

const StudyAnalytics = () => {
  const analytics = [
    { icon: 'fa-clock', value: '4.2h', label: 'Daily Average', color: '#2563eb' },
    { icon: 'fa-bolt', value: '87%', label: 'Productivity', color: '#10b981' },
    { icon: 'fa-fire', value: '12', label: 'Day Streak', color: '#f59e0b' },
    { icon: 'fa-trophy', value: '15/20', label: 'Goals Completed', color: '#8b5cf6' }
  ];

  return (
    <div className="tool-card feature-card">
      <div className="tool-header">
        <div className="tool-icon">
          <i className="fas fa-chart-bar"></i>
        </div>
        <h2>Study Analytics</h2>
      </div>
      
      <div className="analytics-grid">
        {analytics.map((item, index) => (
          <div key={index} className="analytics-card">
            <div className="analytics-icon" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)` }}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <div className="analytics-value">{item.value}</div>
            <div className="analytics-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyAnalytics;