import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Organization from './components/Organization';
import Dashboard from './components/Dashboard';
import RegistrationForm from './components/RegistrationForm';





function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/register' element={<RegistrationForm/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/org' element={<Organization/>}/>
          <Route path='/db' element= { <Dashboard/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}



export default App;
