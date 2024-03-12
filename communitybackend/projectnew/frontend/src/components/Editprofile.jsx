import React, { useState } from 'react'
import NavBar from './NavBar'
import axios from 'axios'



const Editprofile = () => {
    const [input, setInput] = useState([
        {
            "fname": "",
            "lname": "",
            "phone": "",
            "email": "",
            "address": "",
            "interest": "",
            "skills": "",
            "image": "",
        }
    ])
    const inputHandler = (event) => {
        setInput({ ...input, [event.target.name]: event.target.value })

    }
    const readvalues = () => {
        console.log(input)
        axios.post("http://127.0.0.1:8000/task/", input)
            .then((response) => {
                console.log(response.data)
                if (response.status === 201) {
                    alert("success")
                    setInput(
                        {
                            "fname": "",
                            "lname": "",
                            "phone": "",
                            "email": "",
                            "address": "",
                            "interest": "",
                            "skills": "",
                            "image": "",
                        }
                    )

                }
                else {
                    alert("something went wrong")
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
                        <input type="text" className="form-control" name='fname' value={input.fname} onChange={inputHandler} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Last Name</label>
                        <input type="text" className="form-control" name='lname' value={input.lname} onChange={inputHandler} />
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