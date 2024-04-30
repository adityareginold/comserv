import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API } from './config';

const Forgot = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${API}/password_reset/`,
                { email }
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
                { otp_token: otp, email }
            );
            if (response.data.status === "OTP verified") {
                setOtpVerified(true);
            } else {
                alert('OTP Verification failed. Please try again.');
            }
        } catch (error) {
            alert('OTP Verification failed. Please try again.');
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        try {
            const response = await axios.post(
                `${API}/confirm/`,
                { email, otp_token: otp, new_password: newPassword }
            );
            if (response.data.status === "Password updated successfully") {
                navigate('/login');
            } else {
                alert('Password reset failed. Please try again.');
            }
        } catch (error) {
            alert('Password reset failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
                <label>
                    
                    <input type="email" className="form-control" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <button type="submit" className="btn btn-dark">Send OTP</button>
            </form>
            <form onSubmit={handleVerifyOtp}>
                <label>
                    <input type="text" className="form-control"  placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                </label>
                <button type="submit" className="btn btn-dark">Verify OTP</button>
            </form>
            {otpVerified && (
                <form onSubmit={handleResetPassword}>
                    <label>
                       
                        <input type="password" className="form-control" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </label>
                    <label>
                       
                        <input type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </label>
                    <button type="Confirm" className="btn btn-dark">Reset Password</button>
                </form>
            )}
        </div>
    );
};

export default Forgot;