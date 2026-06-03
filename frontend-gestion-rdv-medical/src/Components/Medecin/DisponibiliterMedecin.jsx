import { useEffect, useState } from "react";
import axios from "axios";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import NavMedecin from "./NavMedecin";

export default function DisponibiliterMedecin() {

    const id = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");

    const url = "http://localhost:8080/backend/api/disponibilites";

    const [dispos, setDispos] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        date_disponibilite: "",
        heure_debut: "",
        heure_fin: ""
    });

    // ======================
    // LOAD DISPONIBILITES
    // ======================
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

    // ======================
    // ANTI CHEVAUCHEMENT
    // ======================
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

    // ======================
    // CREATE
    // ======================
    const ajouterDisponibilite = async () => {

        if (!form.date_disponibilite || !form.heure_debut || !form.heure_fin) {
            alert("Tous les champs sont obligatoires");
            return;
        }

        if (form.heure_debut >= form.heure_fin) {
            alert("Heure invalide");
            return;
        }

        if (hasOverlap(form.heure_debut, form.heure_fin, form.date_disponibilite)) {
            alert("Chevauchement détecté !");
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

    // ======================
    // UPDATE
    // ======================
    const modifierDisponibilite = async () => {

        if (hasOverlap(form.heure_debut, form.heure_fin, form.date_disponibilite, editingId)) {
            alert("Chevauchement détecté !");
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

    // ======================
    // DELETE
    // ======================
    const supprimerDisponibilite = async (id) => {
        try {
            await axios.delete(`${url}?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            chargerDisponibilites();
        } catch (error) {
            console.log(error);
        }
    };

    // ======================
    // RESET FORM
    // ======================
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
        setSelectedDate(info.dateStr);
        setEditingId(null);

        setForm({
            date_disponibilite: info.dateStr,
            heure_debut: "",
            heure_fin: ""
        });
    };

    // ======================
    // FILTER BY DATE
    // ======================
    const disposDate = selectedDate
        ? dispos.filter(d => d.date_disponibilite === selectedDate)
        : [];

    // ======================
    // CALENDAR EVENTS
    // ======================
    const events = dispos.map(d => ({
        id: d.id,
        date: d.date_disponibilite,
        title: `${d.heure_debut.substring(0,5)} - ${d.heure_fin.substring(0,5)}`
    }));

    return (
        <div>

            <NavMedecin userId={id} />

            <h2>Gestion des disponibilités</h2>

            {/* ================= CALENDAR ================= */}
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                height="auto"
            />

            {/* ================= FORM ================= */}
            {selectedDate && (
                <div style={{ marginTop: 20 }}>

                    <h3>Date : {selectedDate}</h3>

                    <input
                        type="time"
                        value={form.heure_debut}
                        onChange={(e) =>
                            setForm({ ...form, heure_debut: e.target.value })
                        }
                    />

                    <input
                        type="time"
                        value={form.heure_fin}
                        onChange={(e) =>
                            setForm({ ...form, heure_fin: e.target.value })
                        }
                    />

                    {editingId ? (
                        <button onClick={modifierDisponibilite}>
                            Modifier
                        </button>
                    ) : (
                        <button onClick={ajouterDisponibilite}>
                            Ajouter
                        </button>
                    )}
                </div>
            )}

            {/* ================= LIST ================= */}
            {selectedDate && (
                <div style={{ marginTop: 20 }}>
                    <h3>Disponibilités du jour</h3>

                    {disposDate.length === 0 ? (
                        <p>Aucune disponibilité</p>
                    ) : (
                        disposDate.map(d => (
                            <div key={d.id} style={{
                                border: "1px solid #ccc",
                                padding: 10,
                                margin: 10
                            }}>

                                <p>
                                    {d.heure_debut.substring(0,5)} → {d.heure_fin.substring(0,5)}
                                </p>

                                <button
                                    onClick={() => {
                                        setEditingId(d.id);
                                        setForm({
                                            date_disponibilite: d.date_disponibilite,
                                            heure_debut: d.heure_debut.substring(0,5),
                                            heure_fin: d.heure_fin.substring(0,5)
                                        });
                                    }}
                                >
                                    Modifier
                                </button>

                                <button onClick={() => supprimerDisponibilite(d.id)}>
                                    Supprimer
                                </button>

                            </div>
                        ))
                    )}
                </div>
            )}

        </div>
    );
}