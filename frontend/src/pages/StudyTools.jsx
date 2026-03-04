import React, { useEffect, useState } from 'react'; // Add useState
import PomodoroTimer from '../components/studytools/PomodoroTimer';
import DailyGoals from '../components/studytools/DailyGoals';
import FocusMode from '../components/studytools/FocusMode';
import StudyAnalytics from '../components/studytools/StudyAnalytics';
import QuickSessions from '../components/studytools/QuickSessions';
import SmartBreaks from '../components/studytools/SmartBreaks';
import ChatAssistant from '../components/chat/ChatAssistant';
import Loader from '../components/common/Loader'; // Import Loader
import '../styles/StudyTools.css';

const StudyTools = () => {
  // Add loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to load study tools data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 second loading time
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only run observer when not loading
    if (!loading) {
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
    }
  }, [loading]); // Add loading to dependency

  // Show loader while fetching data
  if (loading) {
    return (
      <div className="page-loader">
        <Loader size="large" text="Loading study tools..." />
      </div>
    );
  }

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