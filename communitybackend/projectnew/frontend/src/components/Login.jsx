import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../design/center.css';
import NavBar3 from './NavBar3';
import {useNavigate} from 'react-router-dom';




const Login = () => {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [username, setUsername] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const history = useHistory();
    const navigate = useNavigate()
    
    useEffect(() => {
        // Fetch CSRF token when component mounts
        async function fetchCsrfToken() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/csrf-token/');
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
                // Handle error by setting a default CSRF token or showing an error message
            }
        }
        fetchCsrfToken();
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/accounts/login/',
                {
                    email: email,
                    password: password,
                },
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                }
            )
            console.log('Login Successful:', response.data);
            window.alert('Login successful!');
            setIsLoggedIn(true);
            // history.push('/db');
            navigate('/db')
            
            
            // Optionally, you can redirect the user to another page upon successful login
        } catch (error) {
            console.error('Login Error:', error);
            window.alert('Login failed. Please try again.');
            // Handle login error, such as displaying an error message to the user
        }
    };

   

     const handleLogout = async () => {
        try {
            // Fetch CSRF token
            const csrfResponse = await fetch('http://127.0.0.1:8000/csrf-token/');
            const csrfData = await csrfResponse.json();
            const csrfToken = csrfData.csrfToken;
    
            // Send logout request
            const response = await axios.post(
                'http://127.0.0.1:8000/accounts/logout/',
                {},
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                }
            );
            console.log('Logout Successful');
            window.alert('Logout successful!');
            setIsLoggedIn(false);
           
            // Optionally, you can redirect the user to another page upon successful logout
        } catch (error) {
            console.error('Logout Error:', error);
            window.alert('Logout failed. Please try again.');
            // Handle logout error, such as displaying an error message to the user
        }
    };
   

    return (
        <div>
           
            <div className="center-container">
                <div className="container-a">
                    <div className="row">
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                            {isLoggedIn ? (
                                
                                <div>
                                    
                                    
                                    {/* <p>Welcome, {username}!</p> */}
                                    <button onClick={handleLogout} className="btn btn-primary">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="row">
                                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="floatingInput"
                                                placeholder="email"
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <label htmlFor="floatingInput">Email</label>
                                        </div>
                                        <div className="form-floating">
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="floatingPassword"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <label htmlFor="floatingPassword">Password</label>
                                        </div>
                                        <p>
                                            <a href="#" className="link-primary">
                                                Forgot Password?
                                            </a>
                                        </p>
                                        <button onClick={handleLogin} className="btn btn-primary">
                                            Login
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;