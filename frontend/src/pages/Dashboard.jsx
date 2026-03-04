import React, { useState, useEffect, useRef } from 'react';
import { dashboardAPI, userAPI } from '../services/api';
import ProgressTracker from '../components/dashboard/ProgressTracker';
import StudyPath from '../components/dashboard/StudyPath';
import SyllabusSection from '../components/dashboard/SyllabusSection';
import SubjectsSection from '../components/dashboard/SubjectsSection';
import StreaksSection from '../components/dashboard/StreaksSection';
import MetricsSection from '../components/dashboard/MetricsSection';
import Loader from '../components/common/Loader';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [activeExam, setActiveExam] = useState('jee');
  const [activeSection, setActiveSection] = useState('progress-tracker');
  
  // Mock data for when API fails
  const [dashboardData, setDashboardData] = useState({
    user: { firstName: 'Rahul', lastName: 'Sharma' },
    stats: {
      totalHours: 124,
      topicsCompleted: 45,
      streak: 7,
      accuracy: 78
    },
    progress: {
      physics: 60,
      chemistry: 45,
      math: 30,
      biology: 65
    },
    streaks: {
      current: 7,
      longest: 15,
      weekly: [true, true, true, true, false, false, false]
    }
  });
  
  const sectionRefs = useRef({});

  // Try to fetch real data, but use mock data if it fails
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API
        const [userData, statsData, progressData, streaksData] = await Promise.all([
          userAPI.getProfile().catch(() => null),
          dashboardAPI.getStats().catch(() => null),
          dashboardAPI.getProgress().catch(() => null),
          dashboardAPI.getStreaks().catch(() => null)
        ]);
        
        // If API succeeds, use real data
        if (userData || statsData || progressData || streaksData) {
          setDashboardData({
            user: userData || dashboardData.user,
            stats: statsData || dashboardData.stats,
            progress: progressData || dashboardData.progress,
            streaks: streaksData || dashboardData.streaks
          });
          setApiError(false);
        } else {
          // Keep using mock data
          setApiError(true);
          console.log('Using mock data - backend not connected');
        }
      } catch (error) {
        console.log('API not available, using mock data');
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
      });

      return () => observer.disconnect();
    }
  }, [loading, activeExam]);

  const handleExamChange = (exam) => {
    setActiveExam(exam);
    setActiveSection('progress-tracker');
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
  };

  const sidebarItems = [
    { id: 'study-plan', icon: 'fa-calendar-alt', label: 'Study Plan' },
    { id: 'subjects', icon: 'fa-book', label: 'Subjects & Topics' },
    { id: 'progress', icon: 'fa-chart-line', label: 'Progress & Reports' },
    { id: 'syllabus', icon: 'fa-list-alt', label: 'Syllabus' },
    { id: 'progress-tracker', icon: 'fa-tasks', label: 'Progress Tracker' },
    { id: 'streaks', icon: 'fa-fire', label: 'Study Streaks' },
  ];

  if (loading) {
    return (
      <div className="page-loader">
        <Loader size="large" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Optional: Show a small indicator that you're using mock data */}
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
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          ⚡ Using Demo Data (Backend not connected)
        </div>
      )}

      <div className="container dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul className="sidebar-menu">
            {sidebarItems.map(item => (
              <li key={item.id} className="sidebar-item">
                <a 
                  href={`#${item.id}`} 
                  className={`sidebar-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSectionChange(item.id);
                  }}
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          
          <div className="exam-selection">
            <div 
              className={`exam-tab jee-tab ${activeExam === 'jee' ? 'active' : ''}`}
              onClick={() => handleExamChange('jee')}
            >
              JEE
            </div>
            <div 
              className={`exam-tab neet-tab ${activeExam === 'neet' ? 'active' : ''}`}
              onClick={() => handleExamChange('neet')}
            >
              NEET
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <section 
            id="progress-tracker" 
            className="section"
            ref={el => sectionRefs.current['progress-tracker'] = el}
          >
            <ProgressTracker examType={activeExam} stats={dashboardData.stats} />
          </section>

          <section 
            id="study-plan" 
            className="section"
            ref={el => sectionRefs.current['study-plan'] = el}
          >
            <StudyPath examType={activeExam} progress={dashboardData.progress} />
          </section>

          <section 
            id="subjects" 
            className="section"
            ref={el => sectionRefs.current['subjects'] = el}
          >
            <SubjectsSection examType={activeExam} />
          </section>

          <section 
            id="progress" 
            className="section"
            ref={el => sectionRefs.current['progress'] = el}
          >
            <MetricsSection examType={activeExam} stats={dashboardData.stats} />
          </section>

          <section 
            id="syllabus" 
            className="section"
            ref={el => sectionRefs.current['syllabus'] = el}
          >
            <SyllabusSection examType={activeExam} />
          </section>

          <section 
            id="streaks" 
            className="section"
            ref={el => sectionRefs.current['streaks'] = el}
          >
            <StreaksSection examType={activeExam} streaks={dashboardData.streaks} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;