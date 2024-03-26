import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import Dropdown from 'react-bootstrap/Dropdown';
import '../design/toggle.css';
import {API} from './config';



const NavBar2 = () => {

    const [username, setUsername] = useState('')
    const [profilePicture, setProfilePicture] = useState('');
    const [option, setOption] = useState('');

    useEffect(() => {
        axios.get(`${API}/get_option/`).then
            (response => setOption(response.data.option));
    }, []);



    useEffect(() => {
        axios.get(`${API}/get_username/`).then
            (response => setUsername(response.data.username));
    }, []);

   
    useEffect(() => {
        axios.get(`${API}/profilepicture/`).then
        (response =>   setProfilePicture(response.data.profilePicture));
    }, []); 
    const handleLogout = () => {
        const csrftoken = Cookies.get('csrftoken');
        axios.post(`${API}/accounts/logout/`, {}, {
            headers: {
                'X-CSRFToken': csrftoken
            }
        })
            .then(
                response => {
                    setUsername('');
                    if (response.data.message) {
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
                    <Link class="navbar-brand" href="#"><h5>CommunityService </h5></Link>
                    <Link class="navbar-brand" href="#"><h5>Welcome {username}</h5> </Link>
                    {/* <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button> */}
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
                        {/* <div>
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/org">Add Services</Link>
                                </li>
                            </ul>
                        </div> */}

                        {/* <div>
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/login" onClick={handleLogout} >Logout</Link>
                                </li>
                            </ul>
                        </div> */}
                        
                    <Dropdown >
                    <Dropdown.Toggle className='dropdown-toggle' id="dropdown-basic">
                        <img src={profilePicture} style={{ borderRadius: '50%', height: '30px', width: '30px' ,border:'none'}} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Link to="/login" onClick={handleLogout} className="dropdown-item">Logout</Link>
                        <Link to="/viewuser" className="dropdown-item">Profile</Link>
                        {/* <Link to="/org" className="dropdown-item">Add Services</Link> */}
                        {option === 'Organization' && <Link to="/org" className="dropdown-item">Add Services</Link>}
                        {option === 'Organization' && <Link to="/viewservices" className="dropdown-item">View Services</Link>}

                    </Dropdown.Menu>
                </Dropdown>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default NavBar2