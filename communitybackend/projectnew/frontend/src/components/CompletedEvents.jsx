import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from './config';
import { useNavigate } from 'react-router-dom';

const CompletedEvents = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        axios.get(`${API}/participated/`)
            .then((response) => {
                setData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(`Error fetching data: ${error}`);
            });
    }, []);

    const handleFeedbackClick = (id) => {
        navigate(`/feedback/${id}`);
    }

    return (
        <div>
            <div className="container">
                <div className="row g-3">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <table className="table table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Objectives</th>
                                    <th>Experience</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Skills required</th>
                                    <th>Tasks</th>
                                    <th>Contact No</th>
                                    <th>Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.image_text.title}</td>
                                        <td>{item.image_text.descr}</td>
                                        <td>{item.image_text.objectives}</td>
                                        <td>{item.image_text.experience}</td>
                                        <td>{item.image_text.date}</td>
                                        <td>{item.image_text.enddate}</td>
                                        <td>{item.image_text.skills}</td>
                                        <td>{item.image_text.tasks}</td>
                                        <td>{item.image_text.contact}</td>
                                        <td>
                                            <button className= "btn btn-dark" onClick={() => handleFeedbackClick(item.id)}>Give Feedback</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletedEvents;