import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from './config';


const Viewfeedback = () => {
    const [data, setData] = useState([]);


    useEffect(() => {
        axios.get(`${API}/feedback/`)
            .then((response) => {
                setData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(`Error fetching data: ${error}`);
            });
    }, []);



    return (
        <div>
            <div className="container">
                <div className="row g-3">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <table className="table table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Rating</th>
                                    <th>General Comments</th>
                                    <th>Organization Feedback</th>
                                    <th>Experience Feedback</th>
                                    <th>Suggestions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.user.first_name}</td>
                                        <td>{item.user.last_name}</td>
                                        <td>{item.user.email}</td>
                                        <td>{item.completed_participation?.image_text?.title}</td>
                                        <td>{item.completed_participation?.image_text?.descr}</td>
                                        <td>{item.completed_participation?.image_text?.date}</td>
                                        <td>{item.completed_participation?.image_text?.enddate}</td>
                                        <td>{item.rating}</td>
                                        <td>{item.general_comments}</td>
                                        <td>{item.organization_feedback}</td>
                                        <td>{item.experience_feedback}</td>
                                        <td>{item.suggestions}</td>
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

export default Viewfeedback;