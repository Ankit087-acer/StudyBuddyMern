import React, { useEffect } from 'react';
import PomodoroTimer from '../components/studytools/PomodoroTimer';
import DailyGoals from '../components/studytools/DailyGoals';
import FocusMode from '../components/studytools/FocusMode';
import StudyAnalytics from '../components/studytools/StudyAnalytics';
import QuickSessions from '../components/studytools/QuickSessions';
import SmartBreaks from '../components/studytools/SmartBreaks';
import ChatAssistant from '../components/chat/ChatAssistant';
import '../styles/StudyTools.css';

const StudyTools = () => {
  useEffect(() => {
    // Scroll animations
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
  }, []);

  return (
    <div className="studytools-page">
      <section className="study-tools-section">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Study Tools & Time Management</h1>
            <p className="page-subtitle">
              Maximize your productivity with AI-powered study tools and smart time management features
            </p>
          </div>

          <div className="tools-grid">
            <PomodoroTimer />
            <DailyGoals />
            <FocusMode />
            <StudyAnalytics />
            <QuickSessions />
            <SmartBreaks />
          </div>
        </div>

        {/* Hidden iframe for lofi music */}
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