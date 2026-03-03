import React, { useState, useEffect, useRef } from 'react';
import '../../styles/PomodoroTimer.css';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const timerRef = useRef(null);
  const [notification, setNotification] = useState(null);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      
      if (!isBreak) {
        // Study session completed
        setSessionCount(prev => prev + 1);
        setIsBreak(true);
        setTimeLeft(5 * 60);
        showNotification('Study session completed! Time for a 5-minute break.');
        playNotificationSound();
      } else {
        // Break completed
        setIsBreak(false);
        setTimeLeft(25 * 60);
        showNotification('Break over! Time to focus again.');
        playNotificationSound();
      }
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, isBreak]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
    setSessionCount(0);
  };

  return (
    <div className="tool-card feature-card">
      <div className="tool-header">
        <div className="tool-icon">
          <i className="fas fa-hourglass-half"></i>
        </div>
        <h2>Pomodoro Timer</h2>
      </div>
      <div className={`timer-container ${isRunning ? 'timer-active' : ''}`}>
        <div className="timer-display">{formatTime()}</div>
        <div className="timer-controls">
          {!isRunning ? (
            <button className="timer-btn btn-primary" onClick={startTimer}>
              <i className="fas fa-play"></i> Start
            </button>
          ) : (
            <button className="timer-btn btn-primary" onClick={pauseTimer}>
              <i className="fas fa-pause"></i> Pause
            </button>
          )}
          <button className="timer-btn btn-outline" onClick={resetTimer}>
            <i className="fas fa-redo"></i> Reset
          </button>
        </div>
        <div className="timer-sessions">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`session-dot ${i < sessionCount ? 'active' : ''}`}
            ></div>
          ))}
        </div>
        <p className="session-info">
          Current Session: <span>{isBreak ? 'Break' : 'Study'}</span>
        </p>
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

export default PomodoroTimer;