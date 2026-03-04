import React, { useEffect, useState } from 'react';
import { studyAPI } from '../services/api';
import PomodoroTimer from '../components/studytools/PomodoroTimer';
import DailyGoals from '../components/studytools/DailyGoals';
import FocusMode from '../components/studytools/FocusMode';
import StudyAnalytics from '../components/studytools/StudyAnalytics';
import QuickSessions from '../components/studytools/QuickSessions';
import SmartBreaks from '../components/studytools/SmartBreaks';
import ChatAssistant from '../components/chat/ChatAssistant';
import Loader from '../components/common/Loader';
import '../styles/StudyTools.css';

const StudyTools = () => {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  
  // Mock data
  const [goals, setGoals] = useState([
    { id: 1, title: 'Complete Physics Chapter 5', subject: 'physics', completed: false, createdAt: new Date().toISOString() },
    { id: 2, title: 'Solve 20 Math problems', subject: 'math', completed: true, createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
    { id: 3, title: 'Revise Organic Chemistry', subject: 'chemistry', completed: false, createdAt: new Date().toISOString() }
  ]);
  
  const [analytics, setAnalytics] = useState({
    dailyAverage: '4.2h',
    productivity: 87,
    streak: 12,
    goalsCompleted: '15/20'
  });

  const [focusTime, setFocusTime] = useState(0);

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API
        const [goalsData, analyticsData] = await Promise.all([
          studyAPI.getGoals().catch(() => null),
          studyAPI.getAnalytics().catch(() => null)
        ]);
        
        if (goalsData || analyticsData) {
          if (goalsData) setGoals(goalsData);
          if (analyticsData) setAnalytics(analyticsData);
          setApiError(false);
        } else {
          setApiError(true);
          console.log('Using mock study data');
        }
        
        const savedFocusTime = localStorage.getItem('totalFocusTime');
        setFocusTime(savedFocusTime ? parseInt(savedFocusTime) : 0);
        
      } catch (error) {
        console.log('API not available, using mock data');
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyData();
  }, []);

  const handleAddGoal = async (goal) => {
    try {
      // Try API first
      const newGoal = await studyAPI.addGoal(goal).catch(() => null);
      if (newGoal) {
        setGoals(prev => [...prev, newGoal]);
      } else {
        // Fallback to local
        const mockGoal = {
          id: Date.now(),
          ...goal,
          completed: false,
          createdAt: new Date().toISOString()
        };
        setGoals(prev => [...prev, mockGoal]);
      }
    } catch (err) {
      console.log('Using local storage for goal');
      const mockGoal = {
        id: Date.now(),
        ...goal,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setGoals(prev => [...prev, mockGoal]);
    }
  };

  const handleCompleteGoal = async (id) => {
    try {
      await studyAPI.updateGoal(id, { completed: true }).catch(() => null);
      setGoals(prev => prev.map(g => 
        g.id === id ? { ...g, completed: true, completedAt: new Date().toISOString() } : g
      ));
    } catch (err) {
      setGoals(prev => prev.map(g => 
        g.id === id ? { ...g, completed: true, completedAt: new Date().toISOString() } : g
      ));
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      await studyAPI.deleteGoal(id).catch(() => null);
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleSaveSession = async (session) => {
    try {
      await studyAPI.saveSession(session).catch(() => null);
      console.log('Session saved:', session);
    } catch (err) {
      console.log('Session saved locally:', session);
    }
  };

  const handleSaveFocusTime = async (minutes) => {
    try {
      await studyAPI.saveFocusTime(minutes).catch(() => null);
      const newTotal = focusTime + minutes;
      setFocusTime(newTotal);
      localStorage.setItem('totalFocusTime', newTotal.toString());
    } catch (err) {
      const newTotal = focusTime + minutes;
      setFocusTime(newTotal);
      localStorage.setItem('totalFocusTime', newTotal.toString());
    }
  };

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animated');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      document.querySelectorAll('.tools-grid, .tool-card').forEach(el => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="page-loader">
        <Loader size="large" text="Loading study tools..." />
      </div>
    );
  }

  return (
    <div className="studytools-page">
      {apiError && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: '#ffd166',
          color: '#1e293b',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          zIndex: 1000
        }}>
          ⚡ Using Demo Data (Backend not connected)
        </div>
      )}

      <section className="study-tools-section">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Study Tools & Time Management</h1>
            <p className="page-subtitle">
              Maximize your productivity with AI-powered study tools and smart time management features
            </p>
          </div>

          <div className="tools-grid">
            <PomodoroTimer onSaveSession={handleSaveSession} />
            <DailyGoals 
              goals={goals}
              onAddGoal={handleAddGoal}
              onCompleteGoal={handleCompleteGoal}
              onDeleteGoal={handleDeleteGoal}
            />
            <FocusMode 
              onSaveFocusTime={handleSaveFocusTime}
              totalFocusTime={focusTime}
            />
            <StudyAnalytics analytics={analytics} />
            <QuickSessions onStartSession={handleSaveSession} />
            <SmartBreaks />
          </div>
        </div>

        <iframe
          id="lofi-player"
          width="0"
          height="0"
          src="https://www.youtube.com/embed/n61ULEU7CO0?start=0&loop=1&playlist=n61ULEU7CO0"
          frameBorder="0"
          allow="autoplay"
          allowFullScreen
          title="lofi music"
        />
      </section>

      <ChatAssistant />
    </div>
  );
};

export default StudyTools;