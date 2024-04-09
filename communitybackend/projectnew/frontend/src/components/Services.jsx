import React, { useEffect, useState } from 'react'
import { API } from './config'
import axios from 'axios'
import { Link } from 'react-router-dom'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


const Services = () => {
    const [data, setData] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({})
    const getData = () => {
        axios.get(`${API}/view_services/`)
            .then((response) => {
                setData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data: ', error);
            });
    }
    const handleEdit = (id, currentData) => {
        setEditingId(id)
        setFormData(currentData)
    }
    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }
    const handleSave = (id) => {
        axios.put(`${API}/update_services/${id}/`, formData)
            .then(response => {
                console.log('Response data:', response.data);
               
                // Update the local data with the response
                const updatedData = data.map(item =>
                    item.id === id ? response.data.image_text : item
                );
                setData(updatedData);
                setEditingId(null);
            })
            .catch(error => {
                console.error('Error updating data: ', error);
            });
    }
    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this service?");
        if (confirmDelete) {
            axios.delete(`${API}/delete_service/${id}/`)
                .then(response => {
                    console.log('Response data:', response.data);
                    
                    // Filter out the deleted item
                    const updatedData = data.filter(item => item.id !== id);
                    setData(updatedData);
                })
                .catch(error => {
                    console.error('Error deleting data: ', error);
                });
        }
    }

    useEffect(() => {
        console.log('Data has been updated:', data);
    }, [data]);
    useEffect(() => { getData(); }, [])
    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <table className="table table-dark table-hover">
                            <tbody>
                               
                                    <thead>
                                        <tr>
                                            <th scope="col">Title</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Contact</th>
                                            <th scope="col">Tasks</th>
                                            <th scope="col">Objectives</th>
                                            <th scope="col">Skills</th>
                                            <th scope="col">Experience</th>
                                            <th scope="col">Image</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.map((value, index) => {
                                                if (editingId === value.id) {
                                                    return (

                                                        <tr>

                                                            <td><input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} /></td>
                                                            <td><input type="text" className="form-control" name="descr" value={formData.descr} onChange={handleInputChange} /></td>
                                                            <td> <input type="text" className="form-control" name="contact" value={formData.contact} onChange={handleInputChange} /></td>
                                                            <td> <input type="text" className="form-control" name="tasks" value={formData.tasks} onChange={handleInputChange} /></td>
                                                            <td> <input type="text" className="form-control" name="objectives" value={formData.objectives} onChange={handleInputChange} /></td>
                                                            <td><input type="text" className="form-control" name="skills" value={formData.skills} onChange={handleInputChange} /></td>
                                                            <td> <input type="text" className="form-control" name="experience" value={formData.experience} onChange={handleInputChange} /></td>
                                                            <td> <input type="text" className="form-control" name="image" value={formData.image} onChange={handleInputChange} /></td>
                                                            <td><button className="btn btn-dark" onClick={() => handleSave(value.id)}>Save</button></td>
                                                        </tr>
                                                    )
                                                }

                                                return <tr>
                                                    <td>{value.title}</td>
                                                    <td>{value.descr}</td>
                                                    <td>{value.contact}</td>
                                                    <td>{value.tasks}</td>
                                                    <td>{value.objectives}</td>
                                                    <td>{value.skills}</td>
                                                    <td>{value.experience}</td>
                                                    <td>{value.image}</td>
                                                    <td><button className="btn btn-dark" onClick={() => handleEdit(value.id, value)}>Edit</button></td>                               
                                                    <td> <button className="btn btn-dark" onClick={() => handleDelete(value.id)}>Delete</button></td>
                                                </tr>
                                            })
                                        }
                                    </tbody>

                              
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        </div >
    )

}

export default Services