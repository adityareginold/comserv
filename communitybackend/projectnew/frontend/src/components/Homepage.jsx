import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { Link } from 'react-router-dom'
import { API } from './config'
import Modal from 'react-modal';
import Moredetails from './Moredetails'
import '../design/ModalStyles.css'


const Homepage = () => {
    const [data, setData] = new useState([])
    const [searchKeyword, setSearchKeyword] = useState('')
    const [filterCriteria, setFilterCriteria] = useState({});
    const [sortField, setSortField] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [skills, setSkills] = useState([]);
    const [location, setLocation] = useState("");
    const [title, setTitle] = useState("");


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

    const handleSortChange = () => {
        axios.get(`${API}/sort_images?sort=${sortField}&order=${sortOrder}`)
            .then((response) => {
                setData(response.data);
            });
    };
    const handleDateSortChange = () => {
        if (startDate && endDate) {
            axios.get(`${API}/filter?startDate=${startDate}&endDate=${endDate}&skills=${skills.join(',')}&location=${location}&title=${title}`)
                .then((response) => {
                    setData(response.data);
                });
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


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState(null);



    useEffect(() => { getData() }, [currentPage])


    return (
        <div>
            <NavBar searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword} handleSearch={handleSearch} />
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <div className="row g-3">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <figure class="text-center">
                                    <blockquote class="blockquote">
                                        <p>“I alone cannot change the world, but I can cast a stone across the waters to create many ripples.” </p>
                                    </blockquote>

                                    <figcaption class="blockquote-footer">
                                        <cite title="Source Title">Mother Teresa</cite>
                                    </figcaption>
                                </figure>
                                {/* <p class="lead">
                                    This is a lead paragraph. It stands out from regular paragraphs.
                                </p> */}
                            </div>

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
                            {/* <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <p>filter</p>
                                <p>Skills</p>
                                <label>
                                    <input type="checkbox" name="title" value="Childcare" onChange={handleFilterChange} />
                                    Child Care
                                </label>
                                <label>
                                    <input type="checkbox" name="skills" value="Plant Trees" onChange={handleFilterChange} />
                                    Plant Trees
                                </label>
                                <label>
                                    <input type="checkbox" name="skills" value="Food Donation" onChange={handleFilterChange} />
                                    Food Donation
                                </label>
                            </div> */}


                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <p>Sort
                                    {/* <select name="sortField" value={sortField} onChange={(e) => { setSortField(e.target.value); handleSortChange(); }}>
                                    <option value="title">Title</option>
                                </select> */}
                                    <select name="sortOrder" value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); handleSortChange(); }}>
                                        <option value="desc">Ascending</option>
                                        <option value="asc">Descending</option>
                                    </select>
                                    Filter by Date Range
                                    <input type="date" name="startDate" value={startDate} onChange={(e) => { setStartDate(e.target.value); }} />
                                    <input type="date" name="endDate" value={endDate} min={startDate} onChange={(e) => { setEndDate(e.target.value); }} />
                                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" />
                                  
                                        <button class="btn btn-dark" onClick={handleDateSortChange}>Apply</button>
                                </p>
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
                                                    <button onClick={() => { setIsModalOpen(true); setSelectedCardId(value.id); }} class="btn btn-dark">More details</button>
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

export default Homepage