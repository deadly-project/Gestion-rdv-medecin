import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'
import Login from './Authentification/Login.jsx'
import Register from './Authentification/Register.jsx'
import Dashboard from './Components/Dashboard.jsx';
import ProtectedRoute from './Configuration/ProtectedRoute.jsx';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard/:role/:id" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
          }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
