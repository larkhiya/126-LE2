import React, { use, useState } from 'react';
import '../styles/SignIn.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../lib/stores/auth.ts';
import { useAuthStore } from '../lib/stores/auth.ts';



function SignIn() {
    const { user } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('htest')

        if (!username || !password) {
            setError('Both fields are required');
        } else {
            setError('');

            // Django setup here
            const res = await login(username, password)
            console.log(res, 'here bitch')
            console.log(user)

            console.log('Username: ', username);
            console.log('Password: ', password);
            alert('Sign In successful');
        }
    };


    return (
        <div className="signin-container">
            <h2>Sign In </h2> 
            {/* {user?.full_name} */}
            <form onSubmit={handleSubmit} className="signin-form">
                <div className="form-item">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>

                <div className="form-item">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>

                {error && <p className="error-message">{error}</p>}
            </form>
            <button type="submit" className="signin-button" >Sign In</button>
            <div className='bottom'>
                <div className='text'>
                    <span className="line"></span>
                    <p>New to baksReader?</p>
                    <span className="line"></span>
                </div>
                <button type="submit" className="signup-button" onClick={() => navigate('/')}>Sign Up</button>
            </div>
        </div>

    );
}

export default SignIn;
