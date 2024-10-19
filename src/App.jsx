import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import DocumentUpload from './Upload';
import './App.css';
import logo from '../src/assets/logo3.png';
import UploadCertificates from './mint';

function App() {
  return (
    <Router>
      <div className="App">
        <div className='top'>
          <div>
      <img src={logo} alt="" />
      </div>
      <div className='topic'>
        <h2>Educational Institute</h2>
      </div>
      </div>
        <header className="App-header">
          
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/upload" element={<DocumentUpload />} />
            <Route path="/mint" element={<UploadCertificates />} />

            
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
