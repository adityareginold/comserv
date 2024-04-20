import React, { useState } from 'react';
import axios from 'axios';
import { API } from './config';
import { useParams } from 'react-router-dom';  
function ResetPassword() {
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const parts = window.location.pathname.split('/');
    
    let { uid, token } = useParams();  
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Add your logic to send the new password to the server here.
        // This will depend on how your Django backend is set up.
        // For example, you might use axios to send a POST request:

        const response = await axios.post(`${API}/reset/${uid}/${token}/`, {
            new_password1: password,
            new_password2: confirmPassword,
          });
        if (response.data.success) {
            alert('Your password has been reset successfully.');
        } else {
            alert('There was an error resetting your password.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                New password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <label>
                Confirm new password:
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </label>
            <input type="submit" value="Reset password" />
        </form>
    );
}

export default ResetPassword;