import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

export default function PriseRdv({  }){
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('id');

  // Simuler une API qui récupère les créneaux libres pour la date choisie
  useEffect(() => {
    const fetchSlots = async () => {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      // Ici, vous appelleriez votre backend : fetch(`/api/slots?date=${dateStr}`)
      // Exemple de données reçues :
      const mockSlots = ['09:00', '09:30', '10:00', '11:00', '14:30', '15:00'];
      setAvailableSlots(mockSlots);
    };

    fetchSlots();
  }, [selectedDate]);

  return (

    <div className="appointment-container">
    <Link to={`/dashboard/${role}/${id}`} >retour</Link>  
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
              <button
                key={slot}
                onClick={() => alert(`Rendez-vous réservé pour ${slot}`)}
                className="slot-button"
              >
                {slot}
              </button>
            ))
          ) : (
            <p className="no-slots-message">Aucun créneau disponible pour ce jour.</p>
          )}
        </div>
      </div>

    </div>
  );
}