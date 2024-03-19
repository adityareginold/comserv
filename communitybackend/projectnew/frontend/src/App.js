import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Organization from './components/Organization';
import Dashboard from './components/Dashboard';
import RegistrationForm from './components/RegistrationForm';
import ViewProfile from './components/ViewProfile';
import Editprofile from './components/EditProfile';
import Moredetails from './components/Moredetails';
import Map from './components/Map';

// import { LoadScript } from '@react-google-maps/api';





function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/register' element={<RegistrationForm />} />
          <Route path='/login' element={<Login />} />
          <Route path='/db' element={<Dashboard />} />
          <Route path='/viewuser' element={<ViewProfile />} />\
          <Route path='/editprofile' element={<Editprofile />} />
          <Route path='/moredetails/:id' element={<Moredetails />} />
          {/* <Route path='/getmap' element={
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <Map />
            </LoadScript>
          }/> */}
            <Route path='/org' element={<Organization />} />
            <Route path='/getmap' element={<Map />} />
         
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
