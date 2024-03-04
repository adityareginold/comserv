import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const NavBar3 = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    
    const handleLogout = async () => {
        try {
            // Your logout logic here
            setIsLoggedIn(false);
            window.alert('Logout successful!');
        } catch (error) {
            console.error('Logout Error:', error);
            window.alert('Logout failed. Please try again.');
            // Handle logout error, such as displaying an error message to the user
        }
    };

    return (
        <div>

            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <Link class="navbar-brand" href="#">Community Service   <p>Welcome, {username}!</p></Link>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <Link class="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                        </ul>
                       
                       
                        <div>
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/" onClick={handleLogout}>Logout</Link>
                                </li>
                                
                            </ul>

                        </div>



                    </div>
                </div>
            </nav>

        </div>
    )
}

export default NavBar3