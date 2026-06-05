import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import axios from "axios";

import "react-calendar/dist/Calendar.css";

export default function PriseRdv() {

    const navigate = useNavigate();

    const { role, id } = useParams();

    const token = sessionStorage.getItem("token");
    const id_user = sessionStorage.getItem("id");

    const [selectedDate, setSelectedDate] =
        useState(new Date());

    const [availableSlots, setAvailableSlots] =
        useState([]);

    const [selectedSlot, setSelectedSlot] =
        useState(null);

    const [motif, setMotif] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const urlSlots =
        "http://localhost:8080/backend/api/slots";

    const urlRdv =
        "http://localhost:8080/backend/api/rendezvous";

    // ==================================
    // CHARGEMENT DES CRENEAUX DU MEDECIN
    // ==================================
    useEffect(() => {

        const fetchSlots = async () => {

            try {

                const dateStr =
                    format(
                        selectedDate,
                        "yyyy-MM-dd"
                    );

                const res =
                    await axios.get(
                        `${urlSlots}?idMedecin=${id}&date=${dateStr}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setAvailableSlots(
                    res.data
                );

                setSelectedSlot(
                    null
                );

            } catch (error) {

                console.error(
                    error
                );
            }
        };

        fetchSlots();

    }, [selectedDate, id, token]);

    // =========================
    // CREATION RDV
    // =========================
    const handleCreateRdv = async () => {

        if (!selectedSlot) {

            alert(
                "Veuillez choisir un créneau."
            );

            return;
        }

        if (!motif.trim()) {

            alert(
                "Veuillez saisir un motif."
            );

            return;
        }

        try {

            setLoading(true);

            const payload = {

                id_medecin:
                    parseInt(id),

                id_disponibilite:
                    selectedSlot.id_disponibilite,

                date_rdv:
                    format(
                        selectedDate,
                        "yyyy-MM-dd"
                    ),

                heure_debut:
                    selectedSlot.heure_debut + ":00",

                heure_fin:
                    selectedSlot.heure_fin + ":00",

                motif:
                    motif
            };

            console.log(
                payload
            );

            const res =
                await axios.post(
                    urlRdv,
                    payload,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            if (res.data.success) {

                alert(
                    "Rendez-vous créé avec succès."
                );

                navigate(
                    `/dashboard/${role}/${id_user}`
                );
            }

        } catch (error) {

            console.error(error);

            if (
                error.response &&
                error.response.data
            ) {

                alert(
                    error.response.data.message
                );

            } else {

                alert(
                    "Erreur lors de la création du rendez-vous."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="appointment-container">

            <Link
                to={`/dashboard/${role}/${id_user}`}
            >
                Retour
            </Link>

            {/* CALENDRIER */}

            <div className="calendar-section">

                <h3 className="section-title">
                    Choisir une date
                </h3>

                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    minDate={new Date()}
                />

            </div>

            {/* CRENEAUX */}

            <div className="slots-section">

                <h3 className="section-title">
                    Créneaux disponibles pour le{" "}
                    {format(
                        selectedDate,
                        "dd/MM/yyyy"
                    )}
                </h3>

                <div className="slots-grid">

                    {
                        availableSlots.length > 0
                            ? availableSlots.map(
                                (slot, index) => (

                                    <button
                                        key={index}
                                        type="button"
                                        className={
                                            selectedSlot === slot
                                                ? "slot-selected"
                                                : "slot-button"
                                        }
                                        onClick={() =>
                                            setSelectedSlot(
                                                slot
                                            )
                                        }
                                    >
                                        {
                                            slot.heure_debut
                                        }
                                        {" - "}
                                        {
                                            slot.heure_fin
                                        }
                                    </button>
                                )
                            )
                            : (
                                <p>
                                    Aucun créneau disponible.
                                </p>
                            )
                    }

                </div>

            </div>

            {/* CRENEAU CHOISI */}

            {
                selectedSlot && (

                    <div
                        style={{
                            marginTop: "20px"
                        }}
                    >

                        <h4>
                            Créneau sélectionné
                        </h4>

                        <p>
                            {
                                selectedSlot.heure_debut
                            }
                            {" - "}
                            {
                                selectedSlot.heure_fin
                            }
                        </p>

                    </div>
                )
            }

            {/* MOTIF */}

            <div
                style={{
                    marginTop: "20px"
                }}
            >

                <label>
                    Motif du rendez-vous
                </label>

                <textarea
                    value={motif}
                    onChange={(e) =>
                        setMotif(
                            e.target.value
                        )
                    }
                    rows={4}
                    placeholder="Décrivez votre besoin..."
                    style={{
                        width: "100%"
                    }}
                />

            </div>

            {/* BOUTON */}

            <div
                style={{
                    marginTop: "20px"
                }}
            >

                <button
                    onClick={
                        handleCreateRdv
                    }
                    disabled={
                        loading
                    }
                >

                    {
                        loading
                            ? "Envoi..."
                            : "Prendre rendez-vous"
                    }

                </button>

            </div>

        </div>
    );
}