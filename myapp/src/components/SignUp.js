// SignUp.js
import React, { useState } from 'react';
import './styles/SignUp.css';  // Make sure to include your styles here

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

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

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
    // If validation passes, proceed with submission (e.g., API call)
    console.log('Form Submitted', formData);

    // Reset form
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
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
        <p className="signin-link">Already have an account? <a href="#">Sign in</a></p>
      </div>
    </div>
  );
}

export default SignUp;