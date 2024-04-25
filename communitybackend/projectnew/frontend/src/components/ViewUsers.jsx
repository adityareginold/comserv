import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API } from './config'
import { Modal, Button } from 'react-bootstrap'

const ViewUsers = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const getUsers = () => {
        axios.get(`${API}/viewusers/`)
            .then((response) => {
                setUsers(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data: ', error);
            });
    }

    const handleRowClick = (user) => {
        setSelectedUser(user)
        setShowModal(true)
    }

    const handleClose = () => setShowModal(false)

    const deleteUser = () => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            axios.delete(`${API}/users/${selectedUser.id}`)
                .then((response) => {
                    console.log(response.data);
                    getUsers(); // Refresh the user list after deletion
                    handleClose(); // Close the modal
                    window.alert('User deleted successfully');
                })
                .catch((error) => {
                    console.error('Error deleting user: ', error);
                });
        }
    }
    useEffect(() => { getUsers(); }, [])

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <table className="table table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index} onClick={() => handleRowClick(user)}>
                                        <td>{user.first_name}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose} contentClassName='bg-dark text-white'>
                <Modal.Header closeButton>
                    <Modal.Title>User Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            <p>Username: {selectedUser.username}</p>
                            <p>Email: {selectedUser.email}</p>
                            {/* Add more fields as needed */}
                            {selectedUser.userprofile && (
                                <div>
                                    <p>Option: {selectedUser.userprofile.option}</p>
                                    <p>Phone: {selectedUser.userprofile.phone}</p>
                                    <p>Address: {selectedUser.userprofile.address}</p>
                                    <p>Skills: {selectedUser.userprofile.skills}</p>
                                    <p>Interest: {selectedUser.userprofile.interest}</p>
                                    <p>Organization Name: {selectedUser.userprofile.organization_name}</p>
                                    <p>Profile Picture:</p>
                                    <img src={selectedUser.userprofile.image} alt="Profile" style={{ width: '50px', height: '50px' }} />
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={deleteUser}>
                        Delete User
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ViewUsers