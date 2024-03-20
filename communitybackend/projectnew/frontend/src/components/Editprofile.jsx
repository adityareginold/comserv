import React, { useState, useEffect } from 'react'
import NavBar from './NavBar'
import axios from 'axios'

const Editprofile = () => {
    const [input, setInput] = useState({
        "first_name": "",
        "last_name": "",
        "phone": "",
        "email": "",
        "address": "",
        "interest": "",
        "skills": "",
    })
    const [csrfToken, setCsrfToken] = useState("");

    

    useEffect(() => {
        const fetchProfileAndCsrfToken = async () => {
            try {
                const profileResponse = await axios.get("http://127.0.0.1:8000/viewprofile/");
                setInput(profileResponse.data);

                const csrfResponse = await axios.get("http://127.0.0.1:8000/csrf-token/");
                setCsrfToken(csrfResponse.data.csrfToken);
            } catch (error) {
                console.error('Error', error);
            }
        };

        fetchProfileAndCsrfToken();
    }, []);


    const inputHandler = (event) => {
        setInput({ ...input, [event.target.name]: event.target.value })
    }

    const readvalues = () => {
        const formData = new FormData();
        formData.append('first_name', input.first_name);
        formData.append('last_name', input.last_name);
        formData.append('phone', input.phone);
        formData.append('email', input.email);
        formData.append('address', input.address);
        formData.append('interest', input.interest);
        formData.append('skills', input.skills);
        axios.put("http://127.0.0.1:8000/updateuser/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRFToken': csrfToken
            }
        })
        .then((response) => {
            console.log(response.data);
            if (response.status === 200) {
                alert("success");
            }
            else {
                alert("something went wrong");
            }
        })
        .catch((error) => {
            console.error('Error', error);
            alert("error occured");
        });
    }

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">First Name</label>
                        <input type="text" className="form-control" name='first_name' value={input.first_name} onChange={inputHandler} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Last Name</label>
                        <input type="text" className="form-control" name='last_name' value={input.last_name} onChange={inputHandler} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Phone</label>
                        <input type="text" className="form-control" name='phone' value={input.phone} onChange={inputHandler} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Email</label>
                        <input type="text" className="form-control" name='email' value={input.email} onChange={inputHandler} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Address:</label>
                        <input type="text" className="form-control" name='address' value={input.address} onChange={inputHandler} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Interest:</label>
                        <input type="text" className="form-control" name='interest' value={input.interest} onChange={inputHandler} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Skills:</label>
                        <input type="text" className="form-control" name='skills' value={input.skills} onChange={inputHandler} />
                    </div>
                    
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <button className="btn btn-dark" onClick={readvalues}>Update</button>
                    </div>

                </div>
            </div>

        </div>

    )
}

export default Editprofile