import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import Organization from './Organization';
import { API } from './config';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        first_name: '',
        last_name: '',
        option: '',
        phone: '',
        address: '',
        interest: '',
        skills: '',
        image: '',
        organization_name: '',
    });
    const [passwordError, setPasswordError] = useState('');
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

    const fileInputChangeHandler = (event) => {
        setFormData({ ...formData, image: event.target.files[0] });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            setPasswordError('Passwords do not match');
            console.error('Passwords do not match');
            return;
        }
        setPasswordError('');
        const dataToSend = { ...formData };
        delete dataToSend.confirm_password;

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        try {
            const response = await axios.post(`${API}/register/`, formData, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'multipart/form-data',
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

                <form onSubmit={handleSubmit}>
                    <div className="row g-3" >
                        <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                            <label htmlFor="first_name" className="form-label">First Name</label>
                            <input type="text" className="form-control" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                        </div>
                        <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                            <label htmlFor="last_name" className="form-label">Last Name</label>
                            <input type="text" className="form-control" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                        </div>
                        <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input type="text" className="form-control" name='phone' value={formData.phone} onChange={handleChange} pattern="\d{10}" onInput={(event) => {
                                event.target.value = event.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                            }} required />
                        </div>
                        <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                            <label htmlFor="" className="form-label">Address:</label>
                            <input type="text" className="form-control" name='address' value={formData.address} onChange={handleChange} required />
                        </div>

                        <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                            <label htmlFor="option" className="form-label">Role:</label>
                            <select className="form-control" id="option" name="option" value={formData.option} onChange={handleChange} required>
                                <option value="Organization">Organization</option>
                                <option value="Volunteer">Volunteer</option>
                            </select>
                        </div>
                        {formData.option !== 'Organization' && (
                            <>
                                <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                    <label htmlFor="" className="form-label">Interest:</label>
                                    <input type="text" className="form-control" name='interest' value={formData.interest} onChange={handleChange} required />
                                </div>
                                <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                    <label htmlFor="" className="form-label">Skills:</label>


                                    <select className="form-control" id="skills" name="skills" value={formData.skills} onChange={handleChange} required>
                                        <option value="Mentoring">Mentoring</option>
                                        <option value="Child Care">Child Care</option>
                                        <option value="Medical Support">Medical Support</option>
                                        <option value="Environmentalist">Environmentalist</option>
                                    </select>
                                </div>
                            </>
                        )}
                        {formData.option !== 'Volunteer' && (<>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-label">Organization Name:</label>
                                <input type="text" className="form-control" name='organization_name' value={formData.organization_name} onChange={handleChange} required />
                            </div>
                        </>)}
                        <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                            <label htmlFor="" className='form-label' >Upload Image</label>
                            <input type="file" className="form-control" name='image' onChange={fileInputChangeHandler} />
                        </div>
                        <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}+\.com$"
                                title="Please include '.com' at the end of your email address" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                            <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" id="confirm_password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
                            {passwordError && <div className="error">{passwordError}</div>}
                        </div>
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-6 col-xl-12 col-xxl-12">
                            <button type="submit" className="btn btn-dark">Register</button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
