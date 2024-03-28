import axios from 'axios'
import NavBar2 from './NavBar2';
import { Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map as MapX, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Overlay from 'ol/Overlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { API } from './config';


const Organization = () => {
    const mapRef = useRef();
    const [currentLocation, setCurrentLocation] = useState(null);
    const [popupContent, setPopupContent] = useState('');
    const [locationName, setLocationName] = useState('');
    const [map, setMap] = useState(null);
    const [vectorSource, setVectorSource] = useState(null);
    const [locationData, setLocationData] = useState({
        "name": "",
        "point": "",
    });  

    const searchLocation = async () => {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationName}`);
        const data = await response.json();
        if (data[0]) {
            const coords = fromLonLat([parseFloat(data[0].lon), parseFloat(data[0].lat)]);
            setCurrentLocation(coords);
            setLocationData({ ...locationData, name: data[0].display_name });
        }
    };

    useEffect(() => {
        if (!currentLocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const coords = fromLonLat([position.coords.longitude, position.coords.latitude]);
                setCurrentLocation(coords);
               
            });
        } else {
            if (!map) {
                const initialVectorSource = new VectorSource();
                const vectorLayer = new VectorLayer({
                    source: initialVectorSource,
                });

                const initialMap = new MapX({
                    target: mapRef.current,
                    layers: [
                        new TileLayer({
                            source: new OSM(),
                        }),
                        vectorLayer,
                    ],
                    view: new View({
                        center: currentLocation,
                        zoom: 18,
                    }),
                });
                //for showing the location
                // initialMap.on('click', async function (event) {
                //   const clickedCoords = event.coordinate;
                //   setCurrentLocation(clickedCoords);
                //   // Reverse geocoding
                //   const lonLat = toLonLat(clickedCoords);
                //   const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lon=${lonLat[0]}&lat=${lonLat[1]}`);
                //   const data = await response.json();
                //   setLocationName(data.display_name);
                // });
                initialMap.on('click', async function (event) {
                    const clickedCoords = event.coordinate;
                    setCurrentLocation(clickedCoords);

                    // Convert the coordinates to latitude and longitude
                    const lonLat = toLonLat(clickedCoords);
                    const lon = lonLat[0];
                    const lat = lonLat[1];

                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lon=${lon}&lat=${lat}`);
                    const data = await response.json();

                    setLocationData({
                        ...locationData,
                        name :data.display_name,
                        point: `POINT ( ${lon.toFixed(2)} ${lat.toFixed(2)} )`
                    })
                    // Set the locationName state to a string that contains the latitude and longitude
                    setLocationName(data.display_name);
                    setLocationName({...locationData ,point : ` POINT ( ${lon.toFixed(2)} ${lat.toFixed(2)} )`});
                });
                setMap(initialMap);
                setVectorSource(initialVectorSource);
            } else {
                map.getView().setCenter(currentLocation);
                vectorSource.clear();

                const marker = new Feature({
                    geometry: new Point(currentLocation),
                });

                marker.setStyle(
                    new Style({
                        image: new Icon({
                            src: 'https://openlayers.org/en/latest/examples/data/icon.png', // replace with your marker image
                        }),
                    })
                );

                vectorSource.addFeature(marker);
            }
        }
    }, [currentLocation, map, vectorSource]);

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
                const response = await axios.get(`${API}/csrf-token/`);
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
        axios.post(`${API}/imagesto/`, formData, {
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
                    const image_text_id = response.data.id;
                    const locationDataWithImageId = {...locationData, image_text_id};
                    

                    axios.post(`${API}/locations/`, locationDataWithImageId, {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrfToken // Include CSRF token in the headers
                        }
                    })
                        .then((response) => {
                            console.log(response.data);
                            if (response.status === 201) {
                                alert("Location added successfully");
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };


    return (
        <div>
            <NavBar2 />
            <div className="container" >
                <div className="row">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <div className="row g-3">
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className=''>Upload Image</label>
                                <input type="file" className="form-control" id="floatingImage" name='image' onChange={fileInputChangeHandler} />
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-label">Title</label>
                                <input type="text" className="form-control" name='title' value={input.title} onChange={inputHandler} />
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="floatingDescription">Description</label>
                                <textarea className="form-control" id="floatingDescription" placeholder="Enter Description" name='descr' value={input.descr} onChange={inputHandler}></textarea>
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-label">Objectives</label>
                                <input type="text" className="form-control" name='objectives' value={input.objectives} onChange={inputHandler} />
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-label">Tasks</label>
                                <input type="text" className="form-control" name='tasks' value={input.tasks} onChange={inputHandler} />
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-label">Skills required</label>
                                <input type="text" className="form-control" name='skills' value={input.skills} onChange={inputHandler} />
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-label">Experience</label>
                                <input type="text" className="form-control" name='experience' value={input.experience} onChange={inputHandler} />
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-label">Contact no</label>
                                <input type="text" className="form-control" name='contact' value={input.contact} onChange={inputHandler} />
                            </div>
                             <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-label">Location Name</label>
                                <input type="text" className="form-control" name='name' value={locationData.name} onChange={e => setLocationData({...locationData, name: e.target.value})} />
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-label">Point</label>
                                <input type="text" className="form-control" name='point' value={locationData.point} onChange={e => setLocationData({...locationData, point: e.target.value})} readOnly/>
                            </div> 
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <input type="text" className="form-control" value={locationName} onChange={e => setLocationName(e.target.value)} placeholder="Enter location name" />
                                <button className="btn btn-dark" onClick={searchLocation}> <FontAwesomeIcon icon={faSearch} /></button>
                            </div>
                            <div style={{ height: '600px', width: '700px' }}>
                                <div id="map" ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
                                <div id="popup">{popupContent}</div>
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6"><button className="btn btn-dark" onClick={readvalues}>submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Organization