import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Organization from './components/Organization';
import Dashboard from './components/Dashboard';
import RegistrationForm from './components/RegistrationForm';
import ViewProfile from './components/ViewProfile';
import Editprofile from './components/Editprofile';
import Moredetails from './components/Moredetails';
import Map from './components/Map';
import Services from './components/Services';
import Modal from 'react-modal';
import Volunteerservices from './components/Volunteerservices';
import CompletedEvents from './components/CompletedEvents';
import FeedbackReview from './components/FeedbackReview';
import Participantsview from './components/Participantsview';
import Viewfeedback from './components/Viewfeedback';
import Forgot from './components/Forgot';
import ResetPassword from './components/ResetPassword';
// rest of your code

// import { LoadScript } from '@react-google-maps/api';



Modal.setAppElement('#root');

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='/register' element={<RegistrationForm />} />
          <Route path='/login' element={<Login />} />
          <Route path='/db' element={<Dashboard />} />
          <Route path='/viewuser' element={<ViewProfile />} />\
          <Route path='/editprofile' element={<Editprofile />} />
          <Route path='/moredetails/:id' element={<Moredetails />} />
          <Route path='/getmap' element={<Map />} />
          <Route path='/org' element={<Organization />} />
          <Route path='/map/:coordinates' element={<Map />} />
          <Route path='/viewservices' element={<Services />} />
          <Route path='volunteerserv' element={<Volunteerservices/>}/>
          <Route path='/compevents' element={<CompletedEvents/>} />
          <Route path='/feedback/:id' element={<FeedbackReview/>} />
          <Route path='/participants' element={<Participantsview/>}/>
          <Route path='/viewfeedback' element={<Viewfeedback/>}/>
          <Route path='/forgotpass' element={<Forgot />} />
          <Route path='/resetpass/:uid/:token' element={ResetPassword} />
            {/* <Route path='/getmap' element={
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <Map />
            </LoadScript>
          }/> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
