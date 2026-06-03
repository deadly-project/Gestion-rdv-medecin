import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import axios from "axios";

export default function PriseRdv(){
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const {role, id} = useParams();
    const roleUser = sessionStorage.getItem('role');
    const token = sessionStorage.getItem('token');
    const id_user = sessionStorage.getItem('id');
    const urlSlots = "http://localhost:8080/backend/api/slots";

  // Simuler une API qui récupère les créneaux libres pour la date choisie
  useEffect(() => {
    const fetchSlots = async () => {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      console.log(id, dateStr);
      const res = await axios.get(
        `${urlSlots}?idMedecin=${id}&date=${dateStr}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
      )
      console.log(res.data);
      setAvailableSlots(res.data);
    };

    fetchSlots();
  }, [selectedDate]);

  return (

    <div className="appointment-container">
    <Link to={`/dashboard/${role}/${id_user}`} >retour</Link>  
      {/* 1. Sélecteur de date */}
      <div className="calendar-section">
        <h3 className="section-title">Choisir une date</h3>
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate} 
          minDate={new Date()} // Empêche de prendre RDV dans le passé
          className="custom-calendar"
        />
      </div>

      {/* 2. Liste des créneaux */}
      <div className="slots-section">
        <h3 className="section-title">
          Créneaux disponibles pour le {format(selectedDate, 'dd/MM/yyyy')}
        </h3>
        
        <div className="slots-grid">
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => (
              
            <div key={slot.id_disponibilite}>
              {slot.heure_debut}
              {slot.heure_fin}
            </div>
            ))
          ) : (
            <p className="no-slots-message">Aucun créneau disponible pour ce jour.</p>
          )}
        </div>
      </div>

    </div>
  );
}