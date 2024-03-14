import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NavBar2 from './NavBar2';


const Organization = () => {
    const [input, setInput] = useState({
        "image": "",
        "title": "",
        "descr": "",
        "contact": "",
        "objectives": "",
        "tasks": "",
        "skills": "",
        "experience": "",

    });
    const [csrfToken, setCsrfToken] = useState('');

    function getCSRFToken() {
        const cookieValue = document.cookie
            .split('; ')
            .find(cookie => cookie.startsWith('csrftoken='))
            .split('=')[1];
        return cookieValue;
    }

    useEffect(() => {
        // Fetch CSRF token when component mounts
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/csrf-token/');
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, []);

    const inputHandler = (event) => {
        setInput({ ...input, [event.target.name]: event.target.value });
    };

    const fileInputChangeHandler = (event) => {
        setInput({ ...input, image: event.target.files[0] });
    };

    const readvalues = () => {
        const formData = new FormData();
        formData.append('image', input.image);
        formData.append('title', input.title);
        formData.append('descr', input.descr);
        formData.append('objectives', input.objectives);
        formData.append('tasks', input.tasks);
        formData.append('skills', input.skills);
        formData.append('experience', input.experience);
        formData.append('contact', input.contact);

        const csrfToken = getCSRFToken();
        axios.post("http://127.0.0.1:8000/imagesto/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRFToken': csrfToken // Include CSRF token in the headers
            }
        })
            .then((response) => {
                console.log(response.data);
                if (response.status === 201) {
                    alert("success");
                    setInput({
                        "image": "",
                        "title": "",
                        "descr": "",
                        "contact": "",
                        "objectives": "",
                        "tasks": "",
                        "skills": "",
                        "experience": "",
                    });
                } else {
                    alert("something went wrong");
                }
            })
            .catch((error) => {
                console.error('Error', error);
                alert("error occurred");
            });
    };


    return (
        <div>
            <NavBar2 />
            <div className="center-container" style={{ paddingTop: '200px' }}>
                <div className="row">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <div className="row g-3">

                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <div className="form-floating ">
                                    <label htmlFor="floatingImage" className=''>Upload Image</label>
                                    <input type="file" className="form-control" id="floatingImage" name='image' onChange={fileInputChangeHandler} />
                                </div>
                                <div className="form-floating">
                                    <input type="text" className="form-control" name='title' value={input.title} onChange={inputHandler} />
                                    <label htmlFor="" className="form-label">Title</label>
                                </div>
                                <div className="form-floating">
                                    <textarea className="form-control" id="floatingDescription" placeholder="Enter Description" name='descr' value={input.descr} onChange={inputHandler}></textarea>
                                    <label htmlFor="floatingDescription">Description</label>
                                </div>
                                <div className="form-floating">
                                    <input type="text" className="form-control" name='objectives' value={input.objectives} onChange={inputHandler} />
                                    <label htmlFor="" className="form-label">Objectives</label>
                                </div>
                                <div className="form-floating">
                                    <input type="text" className="form-control" name='tasks' value={input.tasks} onChange={inputHandler} />
                                    <label htmlFor="" className="form-label">Tasks</label>
                                </div>
                                <div className="form-floating">
                                    <input type="text" className="form-control" name='skills' value={input.skills} onChange={inputHandler} />
                                    <label htmlFor="" className="form-label">Skills required</label>
                                </div>
                                <div className="form-floating">
                                    <input type="text" className="form-control" name='experience' value={input.experience} onChange={inputHandler} />
                                    <label htmlFor="" className="form-label">Experience</label>
                                </div>
                                <div className="form-floating">
                                    <input type="text" className="form-control" name='contact' value={input.contact} onChange={inputHandler} />
                                    <label htmlFor="" className="form-label">Contact no</label>
                                </div>
                                <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                    <button className="btn btn-dark" onClick={readvalues}>submit</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Organization
