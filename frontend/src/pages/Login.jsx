import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    firstName: '', lastName: '', email: '', password: '', currentGrade: '', examType: ''
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Login successful!');
        localStorage.setItem('user_id', data.user_id);
        navigate('/');
      } else {
        alert(`Login failed: ${data.error}`);
      }
    } catch (error) {
      alert('Could not connect to the server');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: registerData.firstName,
          last_name: registerData.lastName,
          email: registerData.email,
          password: registerData.password,
          current_grade: registerData.currentGrade,
          exam_type: registerData.examType
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        setIsRightPanelActive(false);
      } else {
        alert(`Registration failed: ${data.error}`);
      }
    } catch (error) {
      alert('Could not connect to the server');
    }
  };

  return (
    <div className="login-page">
      <div className={`login-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
        <div className="form-container sign-in-container">
          <form onSubmit={handleLoginSubmit}>
            <h1>Welcome Back!</h1>
            <input type="email" name="email" placeholder="Email" required value={loginData.email} onChange={handleLoginChange} />
            <input type="password" name="password" placeholder="Password" required value={loginData.password} onChange={handleLoginChange} />
            <button type="submit">Sign In</button>
            <p className="switch-text">Don't have an account? <span onClick={() => setIsRightPanelActive(true)}>Sign Up</span></p>
          </form>
        </div>

        <div className="form-container sign-up-container">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Create Account</h1>
            <input type="text" name="firstName" placeholder="First Name" required value={registerData.firstName} onChange={handleRegisterChange} />
            <input type="text" name="lastName" placeholder="Last Name" required value={registerData.lastName} onChange={handleRegisterChange} />
            <input type="email" name="email" placeholder="Email" required value={registerData.email} onChange={handleRegisterChange} />
            <input type="password" name="password" placeholder="Password" required value={registerData.password} onChange={handleRegisterChange} />
            
            <p className="status-title">Select Your Status:</p>
            <div className="status-options">
              {['Class 11', 'Class 12', 'Dropper'].map(grade => (
                <React.Fragment key={grade}>
                  <input type="radio" id={grade.replace(' ', '').toLowerCase()} name="currentGrade" value={grade} 
                    checked={registerData.currentGrade === grade} onChange={handleRegisterChange} />
                  <label htmlFor={grade.replace(' ', '').toLowerCase()}>{grade}</label>
                </React.Fragment>
              ))}
            </div>

            <p className="status-title">Select Your Exam:</p>
            <div className="status-options">
              {['JEE', 'NEET'].map(exam => (
                <React.Fragment key={exam}>
                  <input type="radio" id={`exam-${exam.toLowerCase()}`} name="examType" value={exam} 
                    checked={registerData.examType === exam} onChange={handleRegisterChange} />
                  <label htmlFor={`exam-${exam.toLowerCase()}`}>{exam}</label>
                </React.Fragment>
              ))}
            </div>
            
            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Hello, Friend!</h1>
              <p>Enter your details and start your journey with us</p>
            </div>
            <div className="overlay-panel overlay-right" onClick={() => setIsRightPanelActive(true)}>
              <h1>Welcome to StudyBuddy</h1>
              <p>Enter your details and start your journey with us</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;