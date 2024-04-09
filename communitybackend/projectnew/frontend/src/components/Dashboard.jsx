import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import NavBar2 from './NavBar2'
import { Link } from 'react-router-dom'
import { API } from './config'
import Modal from 'react-modal';
import Moredetails from './Moredetails'
import '../design/ModalStyles.css'


const Dashboard = () => {
    const [data, setData] = new useState([])
    const getData = () => {
        axios.get(`${API}/imagesfrom/`).then(
            (response) => { setData(response.data) }
        )
    }
    const updateLikes = id => {
        setData(prevData => {
            return prevData.map(item => {
                if (item.id === id) {
                    return { ...item, likes: item.likes + 1 }
                }
                return item
            })
        })
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState(null);
    

    useEffect(() => { getData() }, [])
    return (
        <div>
            <NavBar2 />
            <div className="container">
                <div className="row g-3">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <div className="row g-3">
                            {
                                data.map((value, index) => {

                                    return <div className="col col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-3">

                                        <div class="card" >
                                            <img height="300px" src={value.image} class="card-img-top" alt="..." />
                                            <div class="card-body">
                                                <h5 class="card-title">{value.title}</h5>
                                                <p class="card-text">{value.descr}</p>
                                                {/* <Link to={`/moredetails/${value.id}`} class="btn btn-dark">More details</Link> */}
                                                <button onClick={() => { setIsModalOpen(true); setSelectedCardId(value.id); }} class="btn btn-dark">More details</button>

                                                <p>
                                                    {value.likes} {value.likes === 1 ? "like" : "likes"}
                                                </p>



                                                <button className="btn btn-dark" onClick={() => updateLikes(value.id)}>Like</button>
                                            </div>
                                        </div>
                                    </div>

                                })
                            }

                        </div>
                    </div>
                </div>

            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                overlayClassName="ReactModal__Overlay"
                className="ReactModal__Content"
            >
                <Moredetails id={selectedCardId} />
            </Modal>


        </div>
    )
}

export default Dashboard



