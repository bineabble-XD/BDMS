import { useState } from 'react'
//import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import Login from './components/login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/login.jsx';
import Register from './components/Register.jsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
