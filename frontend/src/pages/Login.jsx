import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api'; // ✅ Added API import
import logo from '../assets/StudyBuddyLogo.jpg';
import '../styles/Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    status: '',
    examType: ''
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authAPI.login(loginData.email, loginData.password); // ✅ Real API call
      
      // Save token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      showNotification('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      showNotification(error.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    if (!signupData.status || !signupData.examType) {
      showNotification('Please select all options', 'error');
      return;
    }
    
    setIsLoading(true);

    try {
      const userData = {
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        email: signupData.email,
        password: signupData.password,
        current_grade: signupData.status,
        exam_type: signupData.examType
      };
      
      await authAPI.register(userData); // ✅ Real API call
      
      showNotification('Account created! Please login');
      setTimeout(() => setIsLogin(true), 1500);
    } catch (error) {
      showNotification(error.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Form */}
        <div className="login-form-container">
          {isLogin ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="login-form">
              <h2>Welcome Back!</h2>
              <p className="form-subtitle">Sign in to continue your journey</p>
              
              <div className="input-group">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="input-group">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <button type="submit" className="login-submit-btn" disabled={isLoading}>
                {isLoading ? <span className="loading-spinner"></span> : 'Sign In'}
              </button>

              <p className="switch-text">
                Don't have an account?{' '}
                <span onClick={() => !isLoading && setIsLogin(false)}>Create one</span>
              </p>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignupSubmit} className="login-form">
              <h2>Create Account</h2>
              <p className="form-subtitle">Join StudyBuddy today</p>

              <div className="name-group">
                <div className="input-group">
                  <i className="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={signupData.firstName}
                    onChange={handleSignupChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="input-group">
                  <i className="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={signupData.lastName}
                    onChange={handleSignupChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="input-group">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="input-group">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="selection-section">
                <p className="selection-label">Your Status</p>
                <div className="selection-options">
                  <button
                    type="button"
                    className={`option-btn ${signupData.status === 'Class 11' ? 'active' : ''}`}
                    onClick={() => !isLoading && setSignupData({...signupData, status: 'Class 11'})}
                    disabled={isLoading}
                  >
                    Class 11
                  </button>
                  <button
                    type="button"
                    className={`option-btn ${signupData.status === 'Class 12' ? 'active' : ''}`}
                    onClick={() => !isLoading && setSignupData({...signupData, status: 'Class 12'})}
                    disabled={isLoading}
                  >
                    Class 12
                  </button>
                  <button
                    type="button"
                    className={`option-btn ${signupData.status === 'Dropper' ? 'active' : ''}`}
                    onClick={() => !isLoading && setSignupData({...signupData, status: 'Dropper'})}
                    disabled={isLoading}
                  >
                    Dropper
                  </button>
                </div>
              </div>

              <div className="selection-section">
                <p className="selection-label">Your Exam</p>
                <div className="selection-options">
                  <button
                    type="button"
                    className={`option-btn ${signupData.examType === 'JEE' ? 'active' : ''}`}
                    onClick={() => !isLoading && setSignupData({...signupData, examType: 'JEE'})}
                    disabled={isLoading}
                  >
                    JEE
                  </button>
                  <button
                    type="button"
                    className={`option-btn ${signupData.examType === 'NEET' ? 'active' : ''}`}
                    onClick={() => !isLoading && setSignupData({...signupData, examType: 'NEET'})}
                    disabled={isLoading}
                  >
                    NEET
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit-btn" disabled={isLoading}>
                {isLoading ? <span className="loading-spinner"></span> : 'Sign Up'}
              </button>

              <p className="switch-text">
                Already have an account?{' '}
                <span onClick={() => !isLoading && setIsLogin(true)}>Sign in</span>
              </p>
            </form>
          )}
        </div>

        {/* Right Side - Branding with Logo */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="branding-logo">
              <img src={logo} alt="StudyBuddy Logo" />
            </div>
            <h1>StudyBuddy</h1>
            <p>Your AI-powered learning companion for JEE & NEET preparation</p>
            <div className="branding-features">
              <div className="branding-feature">
                <i className="fas fa-robot"></i>
                <span>AI Assistant</span>
              </div>
              <div className="branding-feature">
                <i className="fas fa-chart-line"></i>
                <span>Progress Tracking</span>
              </div>
              <div className="branding-feature">
                <i className="fas fa-clock"></i>
                <span>Smart Timers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <i className={`fas fa-${notification.type === 'error' ? 'exclamation-circle' : 'check-circle'}`}></i>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;