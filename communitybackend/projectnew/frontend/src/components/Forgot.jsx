import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API } from './config';

const Forgot = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const csrfToken = document.cookie.split('csrftoken=')[1];

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${API}/password_reset/`,
                { email },
                { headers: { 'X-CSRFToken': csrfToken } },
            );
            alert('Password reset email has been sent to your email address.');
        } catch (error) {
            alert('Password reset failed. Please try again.');
        }
    };
    
    const handleVerifyOtp = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${API}/verifyotp/`,
                { otp_token: otp, email },
                { headers: { 'X-CSRFToken': csrfToken } },
            );
            if (response.data.status === "OTP verified") {
                navigate('/reset_password');
            } else {
                alert('OTP Verification failed. Please try again.');
            }
        } catch (error) {
            alert('OTP Verification failed. Please try again.');
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
                <button type="submit">Send OTP</button>
            </form>
            <form onSubmit={handleVerifyOtp}>
                <label>
                    OTP:
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                </label>
                <button type="submit">Verify OTP</button>
            </form>
        </div>
    );
};

export default Forgot;