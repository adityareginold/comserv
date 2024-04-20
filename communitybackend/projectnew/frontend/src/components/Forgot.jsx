import React, { useState } from 'react';
import axios from 'axios';
import { API } from './config'; 

const Forgot = () => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        try {
            const csrfToken = document.cookie.split('csrftoken=')[1];  // Get CSRF token from cookie
            const response = await axios.post(
                `${API}/password_reset/`,  // This should be the endpoint for initiating the password reset process
                { email },
                { headers: { 'X-CSRFToken': csrfToken } },  // Include CSRF token in headers
            );
            console.log('Password reset email sent');
            alert('Password reset email has been sent to your email address.');
        } catch (error) {
            console.error('Password Reset Error:', error);
            alert('Password reset failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default Forgot;