import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Organization from './components/Organization';
import Dashboard from './components/Dashboard';
import RegistrationForm from './components/RegistrationForm';
import ViewProfile from './components/ViewProfile';
import Editprofile from './components/EditProfile';
import Moredetails from './components/Moredetails';





function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/register' element={<RegistrationForm/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/org' element={<Organization/>}/>
          <Route path='/db' element= {<Dashboard/>}/>
          <Route path='/viewuser' element= {<ViewProfile/>}/>\
          <Route path='/editprofile' element= {<Editprofile/>}/>
          <Route path='/moredetails/:id' element= {<Moredetails/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}



export default App;
