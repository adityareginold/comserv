import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import Dropdown from 'react-bootstrap/Dropdown'





const NavBar2 = () => {
    const [username, setUsername] = useState('')

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/get_username/")
        .then(response => setUsername(response.data.username));
    }, []);

    const handleLogout = () => {
        const csrftoken = Cookies.get('csrftoken');
        axios.post("http://127.0.0.1:8000/accounts/logout/", {}, {
            headers: {  
                'X-CSRFToken': csrftoken
            }
        })
        .then(
            response => {
                setUsername('');
                if (response.data.message){
                    console.log(response.data.message);
                } else {
                    console.log(response.data);
                }
            });
    }

    return (
        <div>

            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <Link class="navbar-brand" href="#">Community Service </Link>
                    <Link class="navbar-brand" href="#">Welcome {username} </Link>
                    

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <Link class="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                        </ul>
                        <form class="d-flex" role="search">
                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button class="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <div>
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/org">Add Services</Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/login" onClick={handleLogout} >Logout</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default NavBar2