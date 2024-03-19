// // import React, { useEffect, useState } from 'react';
// // import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

// // const Map = () => {
// //     const [selectedLocation, setSelectedLocation] = useState();
// //     const [currentLocation, setCurrentLocation] = useState({lat:0,lng:0});

// //     useEffect(() =>{
// //         navigator.geolocation.getCurrentPosition((position) => {
// //             setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
// //         })
// //     }, []);

// //     const handleMapClick = (event) => {
// //         const { latLng } = event;
// //         const latitude = latLng.lat();
// //         const longitude = latLng.lng();

// //         setSelectedLocation({ latitude, longitude });
// //     };

// //     return (
// //         <div style={{ height: '400px', width: '400px' }}>
// //             <GoogleMap
// //                 mapContainerStyle={{ height: "100%", width: "100%" }}
// //                 center={currentLocation}
// //                 zoom={15}
// //                 onClick={handleMapClick}
// //             >
// //                 <Marker position={currentLocation} />
// //                 {selectedLocation && (
// //                     <Marker
// //                         position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
// //                     >
// //                         <InfoWindow>
// //                             <div>
// //                                 Lat :{selectedLocation.latitude.toFixed(2)},Lng : {selectedLocation.longitude.toFixed(2)}
// //                             </div>
// //                         </InfoWindow>
// //                     </Marker>
// //                 )}
// //             </GoogleMap>
// //         </div>
// //     );
// // };

// // export default Map;


// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';


// const MapClickHandler = ({ setSelectedLocation }) => {
//   const map = useMapEvents({
//     click: (event) => {
//       console.log('Map clicked', event.latlng);
//       setSelectedLocation({ lat: event.latlng.lat, lng: event.latlng.lng });
//     },
//   });

//   return null;
// };


// const Map = () => {
//   const [selectedLocation, setSelectedLocation] = useState();
//   const [currentLocation, setCurrentLocation] = useState();
//   const [loading, setLoading] = useState(true);


//   const icon = L.icon({
//     iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
//     shadowUrl:"https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
//     iconSize: [25, 41], // size of the icon
//     shadowSize: [41, 41], // size of the shadow
//     iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
//     shadowAnchor: [12, 41],  // the same for the shadow
//     popupAnchor: [1, -34] // point from which the popup should open relative to the iconAnchor
//   });

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition((position) => {
//       setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
//       setLoading(false);
//     });
//   }, []);

//   const handleMapClick = (event) => {
//     console.log('Map clicked', event.latlng);
//     setSelectedLocation({ lat: event.latlng.lat, lng: event.latlng.lng });
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div style={{ height: '400px', width: '400px' }}>
//       <MapContainer 
//         center={currentLocation} 
//         zoom={15} 
//         style={{ height: "100%", width: "100%" }}
//         whenCreated={mapInstance => { mapInstance.on('click', handleMapClick); }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//         />
//         <Marker position={currentLocation} icon ={icon}/>
//         {selectedLocation && (
//           <Marker position={selectedLocation} icon={icon}>
//             <Popup>
//               <div>
//                 Lat: {selectedLocation.lat.toFixed(2)}, Lng: {selectedLocation.lng.toFixed(2)}
//               </div>
//             </Popup>
//           </Marker>
//         )}
//       </MapContainer>
//     </div>
//   );
// }

// export default Map;

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

const Map = () => {
  const mapRef = useRef();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [popupContent, setPopupContent] = useState('');
  const [locationName, setLocationName] = useState('');
  const [map, setMap] = useState(null);
  const [vectorSource, setVectorSource] = useState(null);

  const searchLocation = async () => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationName}`);
    const data = await response.json();
    if (data[0]) {
      const coords = fromLonLat([parseFloat(data[0].lon), parseFloat(data[0].lat)]);
      setCurrentLocation(coords);
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
        initialMap.on('click', function (event) {
          const clickedCoords = event.coordinate;
          setCurrentLocation(clickedCoords);
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

  return (
    <div style={{ height: '400px', width: '400px' }}>
      <div id="map" ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
      <div id="popup">{popupContent}</div>
      <input type="text" onChange={e => setLocationName(e.target.value)} placeholder="Enter location name" />
      <button onClick={searchLocation}>Search</button>
    </div>
  );
};

export default Map;