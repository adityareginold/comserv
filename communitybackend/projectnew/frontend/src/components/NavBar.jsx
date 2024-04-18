import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { API } from './config';
import axios from 'axios'


const NavBar = ({ searchKeyword, setSearchKeyword, handleSearch }) => {
    // const [searchKeyword, setSearchKeyword] = useState('');

    // const handleSearch = async (event) => {
    //     event.preventDefault();
    //     try {
    //         const response = await axios.get(`${API}/search/?keyword=${searchKeyword}`);
    //         console.log(response.data); 
    //         // Handle the search results
    //     } catch (error) {
    //         console.error('Failed to search:', error);
    //     }
    // };


    return (
        <div>
            <nav class="navbar  navbar-expand-lg navbar-dark bg-dark">
                <div class="container-fluid">
                    <Link class="navbar-brand" href="#">Community Service </Link>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <Link class="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                        </ul>
                        <form class="d-flex" role="search" onSubmit={handleSearch}>
                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchKeyword}
                                onChange={e => setSearchKeyword(e.target.value)} />
                            <button class="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <div>
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    
                                    <Link class="nav-link active" aria-current="page" to="/login">Login</Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/admin/" target="_blank">Admin Login</Link>
                                </li> */}
                               
                                <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/register">Sign Up</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/feedback">feedback</Link>
                                </li>
    

                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

        </div>
    )
}

export default NavBar