import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import NavBar2 from './NavBar2'

const Dashboard = () => {
    const [data, setData] = new useState([])
    const getData = () => {
        axios.get("http://127.0.0.1:8000/imagesfrom/").then(
            (response) => { setData(response.data) }
        )
    }

    useEffect(() => { getData() }, [])
    return (
        <div>
            <NavBar2/>
            <div className="container">
                <div className="row g-3">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <div className="row g-3">
                        {
                            data.map((value,index) => {

                               return <div className="col col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-3">

                                <div class="card" >
                                                <img height="300px" src={value.image} class="card-img-top" alt="..." />
                                                <div class="card-body">
                                                    <h5 class="card-title">{value.title}</h5>
                                                    <p class="card-text">{value.descr}</p>
                                                    <a href="#" class="btn btn-primary">Go somewhere</a>
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
    )
}

export default Dashboard



