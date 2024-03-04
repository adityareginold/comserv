import React, { useState } from 'react'
import NavBar from './NavBar'
import axios from 'axios'


const Register = () => {
    const [input, setInput] = useState([
        {
            "uname": "",
            "phone": "",
            "password": "",
            "place": "",
            "email": "",
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
                            "uname": "",
                            "phone": "",
                            "password": "",
                            "place": "",
                            "email": "",
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
            <NavBar />
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Username</label>
                        <input type="text" className="form-control" name='uname' value={input.uname} onChange={inputHandler} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Contact No</label>
                        <input type="text" className="form-control" name='phone' value={input.phone} onChange={inputHandler} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Place</label>
                        <input type="text" className="form-control" name='place' value={input.place} onChange={inputHandler} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Email</label>
                        <input type="text" className="form-control" name='email' value={input.email} onChange={inputHandler} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Password:</label>
                        <input type="text" className="form-control" name='password' value={input.password} onChange={inputHandler} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <button className="btn btn-dark" onClick={readvalues}>submit</button>


                    </div>
                </div>
            </div>



        </div>

    )
}

export default Register