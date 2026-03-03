import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    currentGrade: '',
    examType: ''
  });

  // Notification state
  const [notification, setNotification] = useState(null);

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

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Login successful! Redirecting...');
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('user_email', loginData.email);
        setTimeout(() => navigate('/'), 1500);
      } else {
        showNotification(`Login failed: ${data.error}`, 'error');
      }
    } catch (error) {
      showNotification('Could not connect to the server', 'error');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!registerData.currentGrade || !registerData.examType) {
      showNotification('Please select both status and exam type', 'error');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: registerData.firstName,
          last_name: registerData.lastName,
          email: registerData.email,
          password: registerData.password,
          current_grade: registerData.currentGrade,
          exam_type: registerData.examType
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Registration successful! Please login.');
        // Reset form
        setRegisterData({
          firstName: '', lastName: '', email: '', password: '', currentGrade: '', examType: ''
        });
        // Switch to login panel after 2 seconds
        setTimeout(() => setIsRightPanelActive(false), 2000);
      } else {
        showNotification(`Registration failed: ${data.error}`, 'error');
      }
    } catch (error) {
      showNotification('Could not connect to the server', 'error');
    }
  };

  return (
    <div className="login-page">
      <div className={`login-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
        
        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLoginSubmit}>
            <h1>Welcome Back!</h1>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                required 
                value={loginData.email}
                onChange={handleLoginChange}
              />
            </div>
            
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                required 
                minLength="8"
                maxLength="16"
                value={loginData.password}
                onChange={handleLoginChange}
              />
            </div>
            
            <button type="submit" className="login-btn">Sign In</button>
            <p className="switch-text">
              Don't have an account?{' '}
              <span onClick={() => setIsRightPanelActive(true)}>
                Sign Up
              </span>
            </p>
          </form>
        </div>

        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Create Account</h1>
            
            <div className="name-group">
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input 
                  type="text" 
                  name="firstName" 
                  placeholder="First Name" 
                  required 
                  value={registerData.firstName}
                  onChange={handleRegisterChange}
                />
              </div>
              
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input 
                  type="text" 
                  name="lastName" 
                  placeholder="Last Name" 
                  required 
                  value={registerData.lastName}
                  onChange={handleRegisterChange}
                />
              </div>
            </div>

            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                required 
                value={registerData.email}
                onChange={handleRegisterChange}
              />
            </div>

            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                required 
                minLength="8"
                value={registerData.password}
                onChange={handleRegisterChange}
              />
            </div>

            <div className="selection-group">
              <p className="status-title">Select Your Status:</p>
              <div className="status-options">
                <label className={`radio-label ${registerData.currentGrade === 'Class 11' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="currentGrade" 
                    value="Class 11" 
                    checked={registerData.currentGrade === 'Class 11'}
                    onChange={handleRegisterChange}
                  />
                  <span>Class 11</span>
                </label>
                
                <label className={`radio-label ${registerData.currentGrade === 'Class 12' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="currentGrade" 
                    value="Class 12"
                    checked={registerData.currentGrade === 'Class 12'}
                    onChange={handleRegisterChange}
                  />
                  <span>Class 12</span>
                </label>
                
                <label className={`radio-label ${registerData.currentGrade === 'Dropper' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="currentGrade" 
                    value="Dropper"
                    checked={registerData.currentGrade === 'Dropper'}
                    onChange={handleRegisterChange}
                  />
                  <span>Dropper</span>
                </label>
              </div>
            </div>

            <div className="selection-group">
              <p className="status-title">Select Your Exam:</p>
              <div className="status-options">
                <label className={`radio-label ${registerData.examType === 'JEE' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="examType" 
                    value="JEE" 
                    checked={registerData.examType === 'JEE'}
                    onChange={handleRegisterChange}
                  />
                  <span>JEE</span>
                </label>
                
                <label className={`radio-label ${registerData.examType === 'NEET' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="examType" 
                    value="NEET"
                    checked={registerData.examType === 'NEET'}
                    onChange={handleRegisterChange}
                  />
                  <span>NEET</span>
                </label>
              </div>
            </div>
            
            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost-btn" onClick={() => setIsRightPanelActive(false)}>
                <i className="fas fa-arrow-left"></i> Back to Login
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Welcome to StudyBuddy</h1>
              <p>Join thousands of students preparing for JEE & NEET</p>
              <button className="ghost-btn" onClick={() => setIsRightPanelActive(true)}>
                Create Account <i className="fas fa-arrow-right"></i>
              </button>
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