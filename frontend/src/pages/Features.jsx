import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Features.css';

const Features = () => {
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
      { threshold: 0.1 }
    );

    document.querySelectorAll('.feature-card-large, .feature-highlight').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const mainFeatures = [
    {
      icon: 'fa-robot',
      title: 'AI-Powered Learning Assistant',
      description: '24/7 AI support for instant doubt clarification, personalized study recommendations, and intelligent progress tracking.',
      color: '#2563eb',
      details: [
        'Real-time doubt solving',
        'Personalized study plans',
        'Topic recommendations',
        'Performance predictions'
      ]
    },
    {
      icon: 'fa-chart-line',
      title: 'Advanced Analytics',
      description: 'Comprehensive insights into your study patterns, productivity trends, and areas needing improvement.',
      color: '#10b981',
      details: [
        'Weekly progress reports',
        'Topic-wise analysis',
        'Time tracking',
        'Accuracy metrics'
      ]
    },
    {
      icon: 'fa-clock',
      title: 'Smart Time Management',
      description: 'Pomodoro timer, focus mode, and smart scheduling to maximize your study efficiency.',
      color: '#8b5cf6',
      details: [
        'Pomodoro timer',
        'Focus mode',
        'Study streaks',
        'Break reminders'
      ]
    }
  ];

  const secondaryFeatures = [
    {
      icon: 'fa-bullseye',
      title: 'Daily Goals',
      description: 'Set and track daily study goals to stay motivated and consistent.'
    },
    {
      icon: 'fa-book-open',
      title: 'Complete Syllabus Coverage',
      description: 'JEE & NEET syllabus organized with topic-wise breakdown and progress tracking.'
    },
    {
      icon: 'fa-fire',
      title: 'Study Streaks',
      description: 'Build consistency with streak tracking and achievement milestones.'
    },
    {
      icon: 'fa-tasks',
      title: 'Practice Tracker',
      description: 'Track daily practice questions, accuracy, and performance over time.'
    },
    {
      icon: 'fa-music',
      title: 'Smart Breaks',
      description: 'Guided break activities and lofi music to refresh your mind.'
    },
    {
      icon: 'fa-shield-alt',
      title: 'Distraction-Free Mode',
      description: 'Block distractions and stay focused with our focus mode.'
    }
  ];

  const examFeatures = [
    {
      exam: 'JEE Main & Advanced',
      icon: 'fa-calculator',
      color: '#06b6d4',
      features: [
        'Complete Physics, Chemistry, Math syllabus',
        'Topic-wise weightage analysis',
        'Previous year question practice',
        'JEE-specific study plans'
      ]
    },
    {
      exam: 'NEET UG',
      icon: 'fa-dna',
      color: '#10b981',
      features: [
        'Complete Physics, Chemistry, Biology syllabus',
        'NCERT-focused content',
        'Medical entrance exam strategies',
        'NEET-specific mock tests'
      ]
    }
  ];

  return (
    <div className="features-page">
      {/* Hero Section */}
      <section className="features-hero">
        <div className="container">
          <h1 className="features-hero-title">
            Powerful Features for <span className="gradient-text">Exam Success</span>
          </h1>
          <p className="features-hero-subtitle">
            Everything you need to crack JEE & NEET with confidence
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="main-features-section">
        <div className="container">
          <h2 className="section-title text-center">Core Features</h2>
          <p className="section-subtitle text-center">
            AI-powered tools designed to optimize your learning journey
          </p>

          <div className="main-features-grid">
            {mainFeatures.map((feature, index) => (
              <div key={index} className="feature-card-large">
                <div className="feature-icon-large" style={{ background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)` }}>
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <ul className="feature-details-list">
                  {feature.details.map((detail, idx) => (
                    <li key={idx}>
                      <i className="fas fa-check-circle" style={{ color: feature.color }}></i>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Features Grid */}
      <section className="all-features-section">
        <div className="container">
          <h2 className="section-title text-center">Everything You Need</h2>
          <p className="section-subtitle text-center">
            Comprehensive tools to boost your productivity
          </p>

          <div className="features-grid-compact">
            {secondaryFeatures.map((feature, index) => (
              <div key={index} className="feature-card-compact">
                <div className="feature-icon-compact">
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam-Specific Features */}
      <section className="exam-features-section">
        <div className="container">
          <h2 className="section-title text-center">Exam-Specific Preparation</h2>
          <p className="section-subtitle text-center">
            Tailored content for your target exam
          </p>

          <div className="exam-features-grid">
            {examFeatures.map((exam, index) => (
              <div key={index} className="exam-card">
                <div className="exam-header" style={{ background: `linear-gradient(135deg, ${exam.color}, ${exam.color}dd)` }}>
                  <i className={`fas ${exam.icon}`}></i>
                  <h3>{exam.exam}</h3>
                </div>
                <div className="exam-body">
                  <ul>
                    {exam.features.map((feature, idx) => (
                      <li key={idx}>
                        <i className="fas fa-check" style={{ color: exam.color }}></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="features-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of successful students preparing with StudyBuddy</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-large">
                Get Started Free
              </Link>
              <Link to="/study-tools" className="btn btn-outline btn-large">
                Try Study Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;