import { useEffect, useState } from "react";
import axios from "axios";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import NavMedecin from "./NavMedecin";

export default function DisponibiliterMedecin() {

    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const url =
        "http://localhost:8080/backend/api/disponibilites";

    const [dispos, setDispos] = useState([]);

    const [selectedDate, setSelectedDate] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        date_disponibilite: "",
        heure_debut: "",
        heure_fin: ""
    });

    // ======================
    // CHARGEMENT
    // ======================
    const chargerDisponibilites = async () => {

        try {

            const res = await axios.get(
                `${url}?idMedecin=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
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
    // AJOUT
    // ======================
    const ajouterDisponibilite = async () => {

        try {

            await axios.post(
                url,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setForm({
                date_disponibilite: selectedDate,
                heure_debut: "",
                heure_fin: ""
            });

            chargerDisponibilites();

        } catch (error) {

            console.log(error);
        }
    };

    // ======================
    // UPDATE
    // ======================
    const modifierDisponibilite = async () => {

        try {

            await axios.put(
                url,
                {
                    id: editingId,
                    ...form
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEditingId(null);

            setForm({
                date_disponibilite: selectedDate,
                heure_debut: "",
                heure_fin: ""
            });

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

            await axios.delete(
                `${url}?id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            chargerDisponibilites();

        } catch (error) {

            console.log(error);
        }
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
    // DISPONIBILITES DATE
    // ======================
    const disposDate =
        selectedDate === ""
            ? []
            : dispos.filter(
                  d =>
                      d.date_disponibilite ===
                      selectedDate
              );

    // ======================
    // EVENTS CALENDAR
    // ======================
    const events = dispos.map(dispo => ({
        id: dispo.id,
        title:
            dispo.heure_debut.substring(0,5)
            +
            " - "
            +
            dispo.heure_fin.substring(0,5),
        date: dispo.date_disponibilite
    }));

    return (
        <div>

            <NavMedecin userId={id}/>

            <h2>
                Gestion des disponibilités
            </h2>

            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    interactionPlugin
                ]}
                initialView="dayGridMonth"
                locale="fr"
                events={events}
                dateClick={handleDateClick}
                height="auto"
            />

            <hr/>

            {
                selectedDate &&
                (
                    <div>

                        <h3>
                            Date sélectionnée :
                            {" "}
                            {selectedDate}
                        </h3>

                        <input
                            type="time"
                            value={form.heure_debut}
                            onChange={(e)=>
                                setForm({
                                    ...form,
                                    heure_debut:
                                        e.target.value
                                })
                            }
                        />

                        <input
                            type="time"
                            value={form.heure_fin}
                            onChange={(e)=>
                                setForm({
                                    ...form,
                                    heure_fin:
                                        e.target.value
                                })
                            }
                        />

                        {
                            editingId
                            ?
                            (
                                <button
                                    onClick={
                                        modifierDisponibilite
                                    }
                                >
                                    Modifier
                                </button>
                            )
                            :
                            (
                                <button
                                    onClick={
                                        ajouterDisponibilite
                                    }
                                >
                                    Ajouter
                                </button>
                            )
                        }

                    </div>
                )
            }

            <hr/>

            {
                selectedDate &&
                (
                    <div>

                        <h3>
                            Disponibilités du
                            {" "}
                            {selectedDate}
                        </h3>

                        {
                            disposDate.length === 0
                            ?
                            (
                                <p>
                                    Aucune disponibilité
                                </p>
                            )
                            :
                            (
                                disposDate.map(dispo => (

                                    <div
                                        key={dispo.id}
                                        style={{
                                            border:
                                                "1px solid #ccc",
                                            padding:
                                                "10px",
                                            margin:
                                                "10px"
                                        }}
                                    >

                                        <p>
                                            {dispo.heure_debut}
                                            {" → "}
                                            {dispo.heure_fin}
                                        </p>

                                        <button
                                            onClick={() => {

                                                setEditingId(
                                                    dispo.id
                                                );

                                                setForm({
                                                    date_disponibilite:
                                                        dispo.date_disponibilite,
                                                    heure_debut:
                                                        dispo.heure_debut.substring(0,5),
                                                    heure_fin:
                                                        dispo.heure_fin.substring(0,5)
                                                });
                                            }}
                                        >
                                            Modifier
                                        </button>

                                        <button
                                            onClick={() =>
                                                supprimerDisponibilite(
                                                    dispo.id
                                                )
                                            }
                                        >
                                            Supprimer
                                        </button>

                                    </div>

                                ))
                            )
                        }

                    </div>
                )
            }

        </div>
    );
}