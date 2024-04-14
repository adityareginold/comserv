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

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [data, setData] = new useState([])
    const [searchKeyword, setSearchKeyword] = useState('')


      const getData = () => {
        axios.get(`${API}/imagesfrom/?page=${currentPage}`)
               .then((response) => {
                console.log('API response:', response.data); // Log the API response
                setData(response.data.results);
                const itemsPerPage = response.data.results.length;
                const totalItems = response.data.count;
                setTotalPages(Math.ceil(totalItems / itemsPerPage));
                console.log('Total pages:', totalPages); // Log the value of totalPages
            })
            .catch((error) => {
                console.error(`Error fetching data: ${error}`);
            });
    };
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`${API}/search/?keyword=${searchKeyword}`);
            setData(response.data); // Set the search results
        } catch (error) {
            console.error('Failed to search:', error);
        }
    };
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
    

    useEffect(() => { getData() }, [currentPage])
    return (
        <div>
            <NavBar2 searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword} handleSearch={handleSearch} />
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
                        <div className="pagination">
                                <button class="btn btn-dark" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button class="btn btn-dark" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Next</button>
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



