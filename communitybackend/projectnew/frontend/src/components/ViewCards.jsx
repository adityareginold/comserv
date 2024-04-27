import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API } from './config'
import { Modal, Button } from 'react-bootstrap'

const ViewCards = () => {
    const [imagetexts, setImagetexts] = useState([])
    const [selectedImagetext, setSelectedImagetext] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const getImagetexts = () => {
        axios.get(`${API}/imageadmin/`)
            .then((response) => {
                setImagetexts(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data: ', error);
            });
    }

    const handleRowClick = (imagetext) => {
        setSelectedImagetext(imagetext)
        setShowModal(true)
    }

    const handleClose = () => setShowModal(false)

    const deleteImagetext = () => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            axios.delete(`${API}/imageadmin/${selectedImagetext.id}`)
                .then((response) => {
                    console.log(response.data);
                    getImagetexts(); // Refresh the imagetext list after deletion
                    handleClose(); // Close the modal
                    window.alert('Imagetext deleted successfully');
                })
                .catch((error) => {
                    console.error('Error deleting imagetext: ', error);
                });
        }
    }
    useEffect(() => { getImagetexts(); }, [])

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <table className="table table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {imagetexts.map((imagetext, index) => (
                                    <tr key={index} onClick={() => handleRowClick(imagetext)}>
                                        <td>{imagetext.title}</td>
                                        <td>{imagetext.descr}</td>
                                        <td>{imagetext.date}</td>
                                        <td>{imagetext.enddate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose} contentClassName='bg-dark text-white'>
                <Modal.Header closeButton>
                    <Modal.Title>Imagetext Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedImagetext && (
                        <div>
                            <p>Title: {selectedImagetext.title}</p>
                            <p>Description: {selectedImagetext.descr}</p>
                            <p>Objectives: {selectedImagetext.objectives}</p>
                            <p>Tasks: {selectedImagetext.tasks}</p>
                            <p>Skills: {selectedImagetext.skills}</p>
                            <p>Experience: {selectedImagetext.experience}</p>
                            <p>Contact: {selectedImagetext.contact}</p>
                            <p>Start Date: {selectedImagetext.date}</p>
                            <p>End Date: {selectedImagetext.enddate}</p>
                            <p>Image:</p>
                            <img src={selectedImagetext.image} alt="Imagetext" style={{ width: '50px', height: '50px' }} />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={deleteImagetext}>
                        Delete Service
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ViewCards