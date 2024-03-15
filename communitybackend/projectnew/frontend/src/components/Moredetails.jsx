import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';

const Moredetails = () => {
    const [data, setData] = useState(null);
    const { id } = useParams(); // Get the ID from the URL



    useEffect(() => {
        // Fetch card details when component mounts
        const fetchCardDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/imagetext/${id}/`);
                console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
                console.log(response.data);
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch card details:', error);
            }
        };

        fetchCardDetails();
    }, [id]);

    // Render card details
    return (
        <div>
            <NavBar/>
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

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Moredetails;