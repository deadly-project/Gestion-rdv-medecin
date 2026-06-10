import { useEffect, useRef, useState } from "react";
import axios from "axios";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import NavMedecin from "./NavMedecin";
import { BsTrash3, BsPencilSquare, BsCalendarCheck, BsClock, BsPlusCircle } from "react-icons/bs";
import "../../css/DispoMedecin.css";

export default function DisponibiliterMedecin() {
    const id = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");

    const url = "http://localhost:8080/backend/api/disponibilites";

    const [dispos, setDispos] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [editingId, setEditingId] = useState(null);
    
    // 👇 Réf ou état pour conserver l'élément DOM du jour sélectionné dans le calendrier
    const [selectedDayEl, setSelectedDayEl] = useState(null);

    const profileRaw = sessionStorage.getItem("profile");
    const profile = profileRaw ? JSON.parse(profileRaw) : null;

    const [form, setForm] = useState({
        date_disponibilite: "",
        heure_debut: "",
        heure_fin: ""
    });

    const chargerDisponibilites = async () => {
        try {
            const res = await axios.get(
                `${url}?idMedecin=${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDispos(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        chargerDisponibilites();
    }, []);

    const hasOverlap = (start, end, date, ignoreId = null) => {
        const newStart = new Date(`1970-01-01T${start}:00`);
        const newEnd = new Date(`1970-01-01T${end}:00`);

        return dispos.some(d => {
            if (d.date_disponibilite !== date) return false;
            if (ignoreId && d.id === ignoreId) return false;

            const existingStart = new Date(`1970-01-01T${d.heure_debut.substring(0,5)}:00`);
            const existingEnd = new Date(`1970-01-01T${d.heure_fin.substring(0,5)}:00`);

            return newStart < existingEnd && newEnd > existingStart;
        });
    };

    const ajouterDisponibilite = async () => {
        if (!form.date_disponibilite || !form.heure_debut || !form.heure_fin) {
            alert("Tous les champs sont obligatoires");
            return;
        }

        if (form.heure_debut >= form.heure_fin) {
            alert("Heure de fin doit être supérieure à l'heure de début.");
            return;
        }

        if (hasOverlap(form.heure_debut, form.heure_fin, form.date_disponibilite)) {
            alert("Attention : Cette tranche horaire chevauche une disponibilité existante !");
            return;
        }

        try {
            await axios.post(url, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            resetForm();
            chargerDisponibilites();
        } catch (error) {
            console.log(error);
        }
    };

    const modifierDisponibilite = async () => {
        if (form.heure_debut >= form.heure_fin) {
            alert("Heure de fin doit être supérieure à l'heure de début.");
            return;
        }

        if (hasOverlap(form.heure_debut, form.heure_fin, form.date_disponibilite, editingId)) {
            alert("Attention : Cette tranche horaire chevauche une disponibilité existante !");
            return;
        }

        try {
            await axios.put(url, {
                id: editingId,
                ...form
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            resetForm();
            chargerDisponibilites();
        } catch (error) {
            console.log(error);
        }
    };

    const supprimerDisponibilite = async (id) => {
        if(window.confirm("Supprimer cette plage horaire ?")) {
            try {
                await axios.delete(`${url}?id=${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                chargerDisponibilites();
                // Si on supprime l'élément en cours d'édition, reset le formulaire
                if(editingId === id) resetForm();
            } catch (error) {
                console.log(error);
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setForm({
            date_disponibilite: selectedDate,
            heure_debut: "",
            heure_fin: ""
        });
    };

    // ======================
    // CLICK DATE CALENDAR
    // ======================
    const handleDateClick = (info) => {
        // 🎨 Coloration de la case sélectionnée via manipulation de classe CSS directe
        if (selectedDayEl) {
            selectedDayEl.classList.remove("fc-day-selected");
        }
        info.dayEl.classList.add("fc-day-selected");
        setSelectedDayEl(info.dayEl);

        setSelectedDate(info.dateStr);
        setEditingId(null);
        setForm({
            date_disponibilite: info.dateStr,
            heure_debut: "",
            heure_fin: ""
        });
    };

    // ======================
    // CLICK SUR UN ANCIEN CRÉNEAU
    // ======================
    const handleSlotClick = (d) => {
        // Remplir le formulaire avec les heures du créneau et passer en mode "Modification"
        setEditingId(d.id);
        setForm({
            date_disponibilite: d.date_disponibilite,
            heure_debut: d.heure_debut.substring(0,5),
            heure_fin: d.heure_fin.substring(0,5)
        });
    };

    const disposDate = selectedDate
        ? dispos.filter(d => d.date_disponibilite === selectedDate)
        : [];

    const events = dispos.map(d => ({
        id: d.id,
        date: d.date_disponibilite,
        title: `${d.heure_debut.substring(0,5)} - ${d.heure_fin.substring(0,5)}`
    }));

    const formatDateEn = (dateStr) => {
        if (!dateStr) return "";
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('fr-FR', options);
    };

    return (
        <div className="dispo-page-container">
            <NavMedecin userId={id} profile={profile}/>

            <div className="dispo-header">
                <h2><BsCalendarCheck style={{ marginRight: '10px', color: '#2b6cb0' }}/> Vos Disponibilités</h2>
                <p>Configurez vos heures de consultation. Cliquez sur une case ou un créneau existant pour interagir.</p>
            </div>

            <div className="dispo-layout-grid">
                
                {/* Colonne Gauche : Calendrier */}
                <div className="calendar-card-box">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        dateClick={handleDateClick}
                        height="auto"
                        locale="fr"
                        buttonText={{ today: "Aujourd'hui" }}
                    />
                </div>

                {/* Colonne Droite : Formulaire & Actions */}
                <div className="sidebar-actions-panel">
                    {!selectedDate ? (
                        <div className="empty-sidebar-state">
                            <BsClock className="clock-icon-pulse" />
                            <p>Sélectionnez une date sur le calendrier pour commencer.</p>
                        </div>
                    ) : (
                        <>
                            {/* Titre de la date choisie */}
                            <div className="selected-date-badge">
                                <span>{formatDateEn(selectedDate)}</span>
                            </div>

                            {/* Formulaire Inputs */}
                            <div className="time-picker-form-box">
                                <div className="form-title-row">
                                    <h3>{editingId ? "Modifier la plage" : "Ajouter des heures"}</h3>
                                    
                                    {/* 👇 Petit bouton d'ajout rapide si on est en mode édition mais qu'on veut créer un nouveau créneau sur le même jour */}
                                    {editingId && (
                                        <button className="switch-to-add-btn" onClick={resetForm} title="Créer un nouveau créneau pour ce jour">
                                            <BsPlusCircle /> Nouveau créneau
                                        </button>
                                    )}
                                </div>
                                
                                <div className="time-inputs-row">
                                    <div className="input-time-group">
                                        <label>Début</label>
                                        <input
                                            type="time"
                                            value={form.heure_debut}
                                            onChange={(e) => setForm({ ...form, heure_debut: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-time-group">
                                        <label>Fin</label>
                                        <input
                                            type="time"
                                            value={form.heure_fin}
                                            onChange={(e) => setForm({ ...form, heure_fin: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-buttons-group">
                                    {editingId ? (
                                        <>
                                            <button className="btn-action-primary save-btn" onClick={modifierDisponibilite}>
                                                Enregistrer
                                            </button>
                                            <button className="btn-action-secondary" onClick={resetForm}>
                                                Annuler
                                            </button>
                                        </>
                                    ) : (
                                        <button className="btn-action-primary add-btn" onClick={ajouterDisponibilite}>
                                            + Ajouter au calendrier
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Liste des créneaux du jour */}
                            <div className="daily-slots-list-section">
                                <h3>Créneaux du jour (Cliquez pour modifier)</h3>
                                {disposDate.length === 0 ? (
                                    <p className="no-slots-text">Aucune consultation prévue ce jour.</p>
                                ) : (
                                    <div className="slots-vertical-wrapper">
                                        {disposDate.map(d => (
                                            /* 👇 Le clic sur toute la carte du créneau permet de le modifier instantanément */
                                            <div 
                                                key={d.id} 
                                                className={`slot-mini-card clickable-slot ${editingId === d.id ? 'active-editing-slot' : ''}`}
                                                onClick={() => handleSlotClick(d)}
                                            >
                                                <div className="slot-time-display">
                                                    <span className="dot-indicator"></span>
                                                    {d.heure_debut.substring(0,5)} – {d.heure_fin.substring(0,5)}
                                                </div>
                                                
                                                <div className="slot-card-actions">
                                                    <button 
                                                        className="slot-icon-btn delete" 
                                                        title="Supprimer"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Évite de déclencher le handleSlotClick au clic sur supprimer
                                                            supprimerDisponibilite(d.id);
                                                        }}
                                                    >
                                                        <BsTrash3 />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}