import { React, useContext, useState } from "react";
import AuthContext from "../context/AuthContext.js";
import { useNavigate } from 'react-router-dom';
import './style/LoginPage.css';

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    
    // Check for blank fields
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    
    if (!username || !password) {
      setError("All fields should not be blank");
      return;
    }
    
    try {
      const result = await loginUser(e);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h2>Sign In</h2> 
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-item">
            <label htmlFor="username">Username</label>
            <input 
              type="text"
              name="username" 
              placeholder="Enter username" />
          </div>
          <div className="form-item">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password" />
          </div>
          <button type="submit" className="signin-button">Sign In</button>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </form>

        <div className='bottom'>
          <div className='text'>
            <span className="line"></span>
            <p>New to baksReader?</p>
            <span className="line"></span>
          </div>
          <button className="signup-button" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;