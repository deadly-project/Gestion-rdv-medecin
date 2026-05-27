import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'
import Login from './Authentification/Login.jsx'
import Register from './Authentification/Register.jsx'
import Dashboard from './Components/Dashboard.jsx';
import ProtectedRoute from './Configuration/ProtectedRoute.jsx';
import ListMedecins from './Components/Administrateur/ListMedecins.jsx';
import ListPatients from './Components/Administrateur/ListPatients.jsx';
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
          {/* Routes réservées UNIQUEMENT à l'admin */}
        <Route path="/ListMedecins/:role/:id" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ListMedecins/>
          </ProtectedRoute>
        }/>
        
        <Route path="/ListPatients/:role/:id" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ListPatients/>
          </ProtectedRoute>
        }/>

        {/* Exemple de routes pour les autres rôles à ajouter plus tard :
        <Route path="/prendre-rdv/:id" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PrendreRdv />
          </ProtectedRoute>
        }/> 
        */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
