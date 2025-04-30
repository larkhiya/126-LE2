import { useState } from "react";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    full_name: "",
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      // Auto-login
      const loginResponse = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
  
      const loginData = await loginResponse.json();
  
      if (loginResponse.ok) {
        localStorage.setItem("authTokens", JSON.stringify(loginData));
        window.location.href = "/"; // or use `navigate('/')` if you're using react-router
      } else {
        alert("Signup succeeded, but login failed.");
      }
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="full_name" placeholder="Full Name" onChange={handleChange} required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupPage;