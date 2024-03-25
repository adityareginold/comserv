import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { Link } from 'react-router-dom'
import {API} from './config'


const Homepage = () => {
    const [data, setData] = new useState([])
    const getData = () => {
        axios.get(`${API}/imagesfrom/`).then(
            (response) => { setData(response.data) }
        )
    }
    useEffect(() => { getData() }, [])

    return (
        <div>

            <NavBar />
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <div className="row g-3">

                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">

                                <div id="carouselExampleFade" class="carousel slide carousel-fade">
                                    <div class="carousel-inner">
                                        <div class="carousel-item active">


                                            <img width="640px" height="600px" src=" https://gt20.org/wp-content/uploads/2016/09/volunteer.png" class="d-block w-100" alt="..." />
                                        </div>
                                        <div class="carousel-item">
                                            <img width="640px" height="600px" src="https://www.signupgenius.com/cms/socialMediaImages/community-service-ideas.jpg" class="d-block w-100" alt="..." />

                                        </div>
                                        <div class="carousel-item">
                                            <img width="640px" height="600px" src="https://www.themanthanschool.co.in/blog/wp-content/uploads/2020/05/community-service.jpg" class="d-block w-100" alt="..." />
                                        </div>
                                    </div>
                                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Previous</span>
                                    </button>
                                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Next</span>
                                    </button>
                                </div>

                            </div>

                            <div className="row g-3" >
                                {
                                    data.map((value, index) => {

                                        return <div className="col col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-3">

                                            <div class="card" >
                                                <img height="300px" src={value.image} class="card-img-top" alt="..." />
                                                <div class="card-body">
                                                    <h5 class="card-title">{value.title}</h5>
                                                    <p class="card-text">{value.descr}</p>
                                                    <Link to={`/moredetails/${value.id}`} class="btn btn-primary">More details</Link>
                                                </div>
                                            </div>

                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Homepage