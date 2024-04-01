import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from './NavBar';
import { API } from './config'


const Moredetails = () => {
    const [data, setData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const { id } = useParams(); // Get the ID from the URL
    const {lat ,lng } = useParams();



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

    // Render card details
    return (
        <div>
            <NavBar />
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
                                                <td><Link to={`/map/${locationData.features[0].geometry.coordinates[1]},${locationData.features[0].geometry.coordinates[0]}`}>
                                               <span>{locationData.features[0].properties.name}, {locationData.features[0].geometry.coordinates[1]}, {locationData.features[0].geometry.coordinates[0]}</span> 
                                                </Link></td>
                                                
                                            </tr>
                                            {/* <tr>
                                                <td>Location:</td>
                                                <td>{locationData.features[0].properties.name}</td></tr> */}

                                        </>

                                    )}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div >
            ) : (
                <p>Loading...</p>
            )}
        </div >
    );
};

export default Moredetails;