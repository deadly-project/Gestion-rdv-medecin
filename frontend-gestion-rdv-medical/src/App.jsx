import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'
import Login from './Authentification/Login.jsx'
import Register from './Authentification/Register.jsx'
import Dashboard from './Components/Dashboard.jsx';
import ProtectedRoute from './Configuration/ProtectedRoute.jsx';
import ListMedecins from './Components/Administrateur/ListMedecins.jsx';
import ListPatients from './Components/Administrateur/ListPatients.jsx';
import UpdateMedecin from './Components/Administrateur/UpdateMedecin.jsx';
import UpdatePatient from './Components/Administrateur/UpdatePatient.jsx';
import PriseRdv from './Components/Patient/PriseRdv.jsx';
import DisponibiliterMedecin from './Components/Medecin/DisponibiliterMedecin.jsx';
import ListRdvPatient from './Components/Patient/ListRdvPatient.jsx';

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

        <Route path="/UpdateMedecin/:role/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'medecin']}>
            <UpdateMedecin/>
          </ProtectedRoute>
        }/>

        <Route path="/UpdatePatient/:role/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'client']}>
            <UpdatePatient/>
          </ProtectedRoute>
        }/>


        <Route path="/PriseRdv/:role/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'client']}>
            <PriseRdv/>
          </ProtectedRoute>
        }/>

        <Route path="/ListDisponibility/:role/:id" element={
          <ProtectedRoute allowedRoles={['medecin']}>
            <DisponibiliterMedecin/>
          </ProtectedRoute>
        }/>

        <Route path="/ListRdv/:role/:id" element={
          <ProtectedRoute allowedRoles={['client']}>
            <ListRdvPatient/>
          </ProtectedRoute>
        }/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
