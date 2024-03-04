import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fname: '',
        lname: '',
        option: ''
    });
    const [csrfToken, setCSRFToken] = useState('');

    useEffect(() => {
        // Fetch CSRF token from cookie when component mounts
        function fetchCSRFTokenFromCookie() {
            const csrfTokenCookie = document.cookie
                .split('; ')
                .find(cookie => cookie.startsWith('csrftoken='));
            if (csrfTokenCookie) {
                const csrfToken = csrfTokenCookie.split('=')[1];
                setCSRFToken(csrfToken);
            } else {
                console.error('CSRF token not found in cookies');
            }
        }
        fetchCSRFTokenFromCookie();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/register/', formData, {
                headers: {
                    'X-CSRFToken': csrfToken
                }
            });
            console.log('Registration successful:', response.data);
            window.alert("Success")
            // Optionally, you can redirect the user to another page upon successful registration
        } catch (error) {
            console.error('Registration error:', error);
            // Handle registration error, such as displaying an error message to the user
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container">
                <h2>Registration Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="fname" className="form-label">First Name</label>
                        <input type="text" className="form-control" id="fname" name="fname" value={formData.fname} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lname" className="form-label">Last Name</label>
                        <input type="lname" className="form-control" id="lname" name="lname" value={formData.lname} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="option" className="form-label">Dropdown</label>
                        <select className="form-control" id="option" name="option" value={formData.option} onChange={handleChange} required>
                            <option value="">Select an option</option>
                            <option value="option1">Organization</option>
                            <option value="option2">other</option>
                        
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
