// import React, { useEffect, useState } from 'react';
// import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

// const Map = () => {
//     const [selectedLocation, setSelectedLocation] = useState();
//     const [currentLocation, setCurrentLocation] = useState({lat:0,lng:0});

//     useEffect(() =>{
//         navigator.geolocation.getCurrentPosition((position) => {
//             setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
//         })
//     }, []);

//     const handleMapClick = (event) => {
//         const { latLng } = event;
//         const latitude = latLng.lat();
//         const longitude = latLng.lng();

//         setSelectedLocation({ latitude, longitude });
//     };

//     return (
//         <div style={{ height: '400px', width: '400px' }}>
//             <GoogleMap
//                 mapContainerStyle={{ height: "100%", width: "100%" }}
//                 center={currentLocation}
//                 zoom={15}
//                 onClick={handleMapClick}
//             >
//                 <Marker position={currentLocation} />
//                 {selectedLocation && (
//                     <Marker
//                         position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
//                     >
//                         <InfoWindow>
//                             <div>
//                                 Lat :{selectedLocation.latitude.toFixed(2)},Lng : {selectedLocation.longitude.toFixed(2)}
//                             </div>
//                         </InfoWindow>
//                     </Marker>
//                 )}
//             </GoogleMap>
//         </div>
//     );
// };

// export default Map;


import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';




const Map = () => {
  const [selectedLocation, setSelectedLocation] = useState();
  const [currentLocation, setCurrentLocation] = useState();
  const [loading, setLoading] = useState(true);


  const icon = L.icon({
    iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
    shadowUrl:"https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
    iconSize: [25, 41], // size of the icon
    shadowSize: [41, 41], // size of the shadow
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [12, 41],  // the same for the shadow
    popupAnchor: [1, -34] // point from which the popup should open relative to the iconAnchor
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      setLoading(false);
    });
  }, []);

  const handleMapClick = (event) => {
    setSelectedLocation({ lat: event.latlng.lat, lng: event.latlng.lng });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: '400px', width: '400px' }}>
      <MapContainer 
        center={currentLocation} 
        zoom={15} 
        style={{ height: "100%", width: "100%" }}
        whenCreated={mapInstance => { mapInstance.on('click', handleMapClick); }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={currentLocation} icon ={icon}/>
        {selectedLocation && (
          <Marker position={selectedLocation} icon={icon}>
            <Popup>
              <div>
                Lat: {selectedLocation.lat.toFixed(2)}, Lng: {selectedLocation.lng.toFixed(2)}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default Map;