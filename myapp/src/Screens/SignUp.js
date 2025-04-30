// SignUp.js
import React, { useState } from 'react';
import '../styles/SignUp.css';
import { useNavigate } from 'react-router-dom';


function SignUp() {
  // State to store form data
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  // State for error messages
  const [error, setError] = useState('');

  const navigate = useNavigate();


  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // STOP form from refreshing
  
    const { name, username, email, password } = formData;
  
    // Simple validation
    if (!name || !username || !email || !password) {
      setError('All fields are required');
      return;
    }
  
    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
  
    setError('');
  
    // If validation passes, proceed with API call
    fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          alert('User registered successfully!');
          // Reset form after successful registration
          setFormData({
            name: '',
            username: '',
            email: '',
            password: '',
          });
        } else {
          setError('Registration failed. Try a different username.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Something went wrong. Please try again later.');
      });
  };

  return (
    <div className="container">
      <div className="signup-form">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your first and last name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hello@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            <p className="password-hint">Password must be at least 6 characters</p>
          </div>

          <button type="submit" className="create-account-btn">Create account</button>
        </form>
        <p className="signin-link">Already have an account? <span onClick={() => navigate('/signin')}>Sign in</span></p>
      </div>
    </div>
  );
}

export default SignUp;