import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from './NavBar';
import { API } from './config'
import Modal from 'react-modal';
import Map from './Map'




const Moredetails = ({ id }) => {
    const [data, setData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    // const { id } = useParams();
    const { lat, lng } = useParams();
    const [participationStatus, setParticipationStatus] = useState(false);
    const [registrationError, setRegistrationError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [selectedMapId, setSelectedMapId] = useState(null);
    const handleMapClick = (id) => {
        setSelectedMapId(id);
        setIsMapModalOpen(true);
    };


    useEffect(() => {
        // Fetch card details when component mounts
        const fetchCardDetails = async () => {
            try {
                const response = await axios.get(`${API}/imagetext/${id}/`);
                console.log('Card data:', response.data);
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch card details:', error);
            }

            try {
                const locationResponse = await axios.get(`${API}/locations/${id}/`);
                console.log('Location data:', locationResponse.data);
                setLocationData(locationResponse.data);  // Set the location data
            } catch (error) {
                console.error('Failed to fetch location data:', error);
            }
        };

        fetchCardDetails();
    }, [id]);
    // Function to get the current user data
    const handleParticipation = async () => {
        try {


            await axios.post(`${API}/participation/`, { imageTextId: id });
            // If participation is successful, update participation status
            setParticipationStatus(true);
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message) {
                // If the user is already registered, set registration error message
                setRegistrationError(error.response.data.message);
                alert(error.response.data.message);
            } else {
                console.error('Failed to participate:', error);
            }
        }
    };



    // Render card details
    return (
        <div>

            {data ? (

                <div className="container">
                    <div className="row g-3">
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                            <table className="table table-dark table-hover">
                                <tbody>
                                    <tr>
                                        <td>Objectives:</td>
                                        <td>{data.objectives}</td>
                                    </tr>
                                    <tr>
                                        <td>Experience:</td>
                                        <td>{data.experience}</td>
                                    </tr>
                                    <tr>
                                        <td>Start Date:</td>
                                        <td>{data.date}</td>
                                    </tr>
                                    <tr>
                                        <td>End Date:</td>
                                        <td>{data.enddate}</td>
                                    </tr>
                                    <tr>
                                        <td>Skills required:</td>
                                        <td>{data.skills}</td>
                                    </tr>
                                    <tr>
                                        <td>Tasks</td>
                                        <td>{data.tasks}</td>
                                    </tr>
                                    <tr>
                                        <td>Contact No:</td>
                                        <td>{data.contact}</td>
                                    </tr>

                                    {locationData && locationData.features && locationData.features.length > 0 && (
                                        <>
                                            <tr>
                                                <td>Location:</td>
                                                {/* <td><button onClick={() => handleMapClick(locationData.features[0].id)}>Open Map</button></td> */}
                                                {/* <td><Link to={`/map/${locationData.features[0].geometry.coordinates[1]},${locationData.features[0].geometry.coordinates[0]}`}>
                                                    <span>{locationData.features[0].properties.name}, {locationData.features[0].geometry.coordinates[1]}, {locationData.features[0].geometry.coordinates[0]}</span>
                                                </Link></td> */}
                                                <td>

                                                    <Link
                                                        to={`/map/${locationData.features[0].geometry.coordinates[1]},${locationData.features[0].geometry.coordinates[0]}`}
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            handleMapClick(locationData.features[0].id);
                                                        }}
                                                    >
                                                        <span>{locationData.features[0].properties.name}, {locationData.features[0].geometry.coordinates[1]}, {locationData.features[0].geometry.coordinates[0]}</span>
                                                    </Link>

                                                </td>

                                            </tr>
                                        </>
                                    )}
                                    <tr>
                                        <td>Participate:</td>
                                        <td>  <button className="btn btn-dark" onClick={handleParticipation} disabled={participationStatus}>
                                            {participationStatus ? 'Registered' : 'Participate'}
                                        </button></td>
                                    </tr>
                                </tbody>
                            </table>


                        </div>
                    </div>
                </div >
            ) : (
                <p>Loading...</p>
            )}

            {isMapModalOpen && (
                <Modal isOpen={isMapModalOpen} onRequestClose={() => setIsMapModalOpen(false)}>
                    <Map coordinates={`${locationData.features[0].geometry.coordinates[1]},${locationData.features[0].geometry.coordinates[0]}`} />
                    <button onClick={() => setIsMapModalOpen(false)}>Close</button>
                </Modal>
            )}
        </div >
    );
};

export default Moredetails;