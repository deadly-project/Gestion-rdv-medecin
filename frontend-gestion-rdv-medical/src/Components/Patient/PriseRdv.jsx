import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";

// Importation de FullCalendar à la place de react-calendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { BsArrowLeft, BsClock, BsChatRightText, BsCalendarCheck } from "react-icons/bs";
import "../../css/PriseRdv.css"; 

export default function PriseRdv() {
    const navigate = useNavigate();
    const { role, id } = useParams();

    const token = sessionStorage.getItem("token");
    const id_user = sessionStorage.getItem("id");

    // On garde ton état initial Date classique
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [motif, setMotif] = useState("");
    const [loading, setLoading] = useState(false);

    const urlSlots = "http://localhost:8080/backend/api/slots";
    const urlRdv = "http://localhost:8080/backend/api/rendezvous";

    // ==================================
    // CHARGEMENT DES CRENEAUX (Ton code d'origine préservé)
    // ==================================
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const dateStr = format(selectedDate, "yyyy-MM-dd");

                const res = await axios.get(
                    `${urlSlots}?idMedecin=${id}&date=${dateStr}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setAvailableSlots(res.data);
                setSelectedSlot(null);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSlots();
    }, [selectedDate, id, token]);

    // ==================================
    // GESTION DES CLICS SUR LE CALENDRIER
    // ==================================
    const handleDateClick = (info) => {
        // FullCalendar donne la date sous forme de string "YYYY-MM-DD", on la convertit en objet Date
        const nouvelleDate = new Date(info.dateStr);
        setSelectedDate(nouvelleDate);

        // Effet visuel de sélection de la case
        document.querySelectorAll(".fc-day-selected").forEach(el => el.classList.remove("fc-day-selected"));
        info.dayEl.classList.add("fc-day-selected");
    };

    // Au cas où l'utilisateur clique sur un événement directement dans le calendrier
    const handleEventClick = (info) => {
        const eventDate = new Date(info.event.start);
        setSelectedDate(eventDate);
    };

    // =========================
    // CREATION RDV (Ton code d'origine préservé)
    // =========================
    const handleCreateRdv = async () => {
        if (!selectedSlot) {
            alert("Veuillez choisir un créneau.");
            return;
        }

        if (!motif.trim()) {
            alert("Veuillez saisir un motif.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                id_medecin: parseInt(id),
                id_disponibilite: selectedSlot.id_disponibilite,
                date_rdv: format(selectedDate, "yyyy-MM-dd"),
                heure_debut: selectedSlot.heure_debut + ":00",
                heure_fin: selectedSlot.heure_fin + ":00",
                motif: motif
            };

            const res = await axios.post(
                urlRdv,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.data.success) {
                alert("Rendez-vous créé avec succès.");
                navigate(`/dashboard/${role}/${id_user}`);
            }

        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                alert(error.response.data.message);
            } else {
                alert("Erreur lors de la création du rendez-vous.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Convertir les créneaux du jour en événements affichables sur FullCalendar
    const events = availableSlots.map((slot, index) => ({
        id: String(index),
        date: format(selectedDate, "yyyy-MM-dd"),
        title: `${slot.heure_debut} - ${slot.heure_fin}`
    }));

    return (
        <div className="booking-page-container">
            
            <div className="booking-back-nav">
                <Link to={`/dashboard/${role}/${id_user}`} className="back-link-btn">
                    <BsArrowLeft /> Retour
                </Link>
            </div>

            <div className="booking-header">
                <h2><BsCalendarCheck style={{ marginRight: '10px', color: '#10b981' }}/> Planifier un rendez-vous</h2>
                <p>Sélectionnez une date pour voir et choisir parmi les créneaux disponibles.</p>
            </div>

            <div className="booking-layout-grid">
                
                {/* COLONNE GAUCHE : LE CALENDRIER FULLCALENDAR */}
                <div className="booking-calendar-card">
                    <h3 className="widget-title">Choisir une date</h3>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events} // Affiche les créneaux du jour sélectionné
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        height="auto"
                        locale="fr"
                        buttonText={{ today: "Aujourd'hui" }}
                    />
                </div>

                {/* COLONNE DROITE : SELECTION DU CRENEAU ET MOTIF */}
                <div className="booking-actions-panel">
                    
                    <div className="booking-section-block">
                        <h3 className="widget-title">
                            Créneaux disponibles pour le {format(selectedDate, "dd/MM/yyyy")}
                        </h3>
                        
                        <div className="rdv-slots-grid">
                            {availableSlots.length > 0 ? (
                                availableSlots.map((slot, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`rdv-slot-btn ${selectedSlot === slot ? "active-slot" : ""}`}
                                        onClick={() => setSelectedSlot(slot)}
                                    >
                                        <BsClock className="slot-clock-icon" />
                                        {slot.heure_debut} - {slot.heure_fin}
                                    </button>
                                ))
                            ) : (
                                <div className="no-slots-alert">
                                    <p>Aucun créneau disponible pour cette date.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* BLOC RÉCAPITULATIF ET MOTIF */}
                    <div className="booking-section-block confirmation-form-fade">
                        {selectedSlot && (
                            <div style={{ marginBottom: "15px" }}>
                                <h4>Créneau sélectionné :</h4>
                                <p className="selected-slot-summary-text">
                                    <strong>{selectedSlot.heure_debut} - {selectedSlot.heure_fin}</strong>
                                </p>
                            </div>
                        )}

                        <div className="textarea-input-group">
                            <label className="widget-title" style={{ display: 'block', marginBottom: '8px' }}>
                                Motif du rendez-vous
                            </label>
                            <textarea
                                value={motif}
                                onChange={(e) => setMotif(e.target.value)}
                                rows={4}
                                placeholder="Décrivez votre besoin..."
                                className="rdv-textarea"
                            />
                        </div>

                        <button 
                            className="confirm-booking-btn"
                            onClick={handleCreateRdv}
                            disabled={loading}
                            style={{ marginTop: '20px' }}
                        >
                            {loading ? "Envoi..." : "Prendre rendez-vous"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}