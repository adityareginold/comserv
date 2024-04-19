import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from './config';
import { useNavigate } from 'react-router-dom';

const Participantsview = () => {
    const [data, setData] = useState([]);


    useEffect(() => {
        axios.get(`${API}/getparticipants/`)
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
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Skill</th>
                                    <th>Interest</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Objectives</th>
                                    <th>Experience</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Skills required</th>
                                    <th>Tasks</th>
                                    <th>Contact No</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.user.first_name}</td>
                                        <td>{item.user.last_name}</td>
                                        <td>{item.user.email}</td>
                                        <td>{item.user.profile.phone}</td>
                                        <td>{item.user.profile.address}</td>
                                        <td>{item.user.profile.skills}</td>
                                        <td>{item.user.profile.interest}</td>
                                        <td>{item.image_text.title}</td>
                                        <td>{item.image_text.descr}</td>
                                        <td>{item.image_text.objectives}</td>
                                        <td>{item.image_text.experience}</td>
                                        <td>{item.image_text.date}</td>
                                        <td>{item.image_text.enddate}</td>
                                        <td>{item.image_text.skills}</td>
                                        <td>{item.image_text.tasks}</td>
                                        <td>{item.image_text.contact}</td>
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

export default Participantsview;