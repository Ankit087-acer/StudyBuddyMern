import React, { useState, useEffect } from 'react';
import '../../styles/DailyGoals.css';

const DailyGoals = () => {
  const [goals, setGoals] = useState([]);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalSubject, setGoalSubject] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const savedGoals = localStorage.getItem('studyGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studyGoals', JSON.stringify(goals));
  }, [goals]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addGoal = () => {
    if (goalTitle.trim() && goalSubject) {
      const newGoal = {
        id: Date.now(),
        title: goalTitle,
        subject: goalSubject,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      };
      setGoals([...goals, newGoal]);
      setGoalTitle('');
      setGoalSubject('');
      showNotification('Goal added successfully!');
    } else {
      showNotification('Please fill in both goal title and subject.', 'error');
    }
  };

  const completeGoal = (id) => {
    setGoals(goals.map(goal =>
      goal.id === id
        ? { ...goal, completed: true, completedAt: new Date().toISOString() }
        : goal
    ));
    showNotification('Goal marked as completed! 🎉');
  };

  const deleteGoal = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(goal => goal.id !== id));
      showNotification('Goal deleted.');
    }
  };

  const subjects = [
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'maths', label: 'Mathematics' },
    { value: 'biology', label: 'Biology' }
  ];

  return (
    <div className="tool-card feature-card">
      <div className="tool-header">
        <div className="tool-icon">
          <i className="fas fa-bullseye"></i>
        </div>
        <h2>Daily Goals</h2>
      </div>
      
      <div className="goal-form">
        <div className="form-group">
          <label htmlFor="goal-title">Goal Title</label>
          <input
            type="text"
            id="goal-title"
            className="form-control"
            placeholder="e.g., Revise 2 chapters of Physics"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="goal-subject">Subject</label>
          <select
            id="goal-subject"
            className="form-control"
            value={goalSubject}
            onChange={(e) => setGoalSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map(subject => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={addGoal} style={{ width: '100%' }}>
          <i className="fas fa-plus"></i> Add Goal
        </button>
      </div>

      <div className="goals-list">
        {goals.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-clipboard-list"></i>
            <p>No goals set yet. Add your first goal above!</p>
          </div>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className={`goal-item ${goal.completed ? 'completed' : ''}`}>
              <div className="goal-info">
                <h4>{goal.title}</h4>
                <p>Subject: {goal.subject.charAt(0).toUpperCase() + goal.subject.slice(1)}</p>
                <small>Created: {new Date(goal.createdAt).toLocaleDateString()}</small>
                {goal.completed && (
                  <small className="completed-text">
                    Completed: {new Date(goal.completedAt).toLocaleDateString()}
                  </small>
                )}
              </div>
              <div className="goal-actions">
                {!goal.completed && (
                  <button
                    className="goal-btn btn-complete"
                    onClick={() => completeGoal(goal.id)}
                    title="Mark as completed"
                  >
                    <i className="fas fa-check"></i>
                  </button>
                )}
                <button
                  className="goal-btn btn-delete"
                  onClick={() => deleteGoal(goal.id)}
                  title="Delete goal"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
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

export default DailyGoals;