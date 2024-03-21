import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
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
                        <form class="d-flex" role="search">
                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button class="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <div>
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/login">Login</Link>
                                </li>
                                {/* 
                                <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/db">testdashboard</Link>
                                </li> */}
                                <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/register">Sign Up</Link>
                                </li>
                                {/* <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/getmap">View map testing</Link>
                                </li> */}
                                {/* <li class="nav-item">
                                    <Link class="nav-link active" aria-current="page" to="/viewprofile">viewprofile</Link>
                                </li> */}
                               

                            </ul>

                        </div>


                    </div>
                </div>
            </nav>

        </div>
    )
}

export default NavBar