import axios from "axios";
import { useEffect, useState } from "react";

import Profile from "../Common/Profil";
import NavPatients from "./NavPatients";
import ListMedecinForPatients from "./ListMedecinForPatients";

export default function PatientDashboard({ userId }) {

    const token = localStorage.getItem("token");

    const urlProfile =
        "http://localhost:8080/backend/api/profile";

    const urlMedecins =
        "http://localhost:8080/backend/api/medecins";

    const [profile, setProfile] =
        useState(null);

    const [medecins, setMedecins] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [filters, setFilters] = useState({
        nom: "",
        specialite: "",
        lieu: "",
        tauxMin: "",
        tauxMax: ""
    });

    // CHARGEMENT INITIAL
    useEffect(() => {

        const loadData = async () => {

            try {

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const [profileRes, medecinsRes] =
                    await Promise.all([
                        axios.get(
                            urlProfile,
                            { headers }
                        ),

                        axios.get(
                            urlMedecins,
                            { headers }
                        )
                    ]);

                setProfile(
                    profileRes.data
                );

                setMedecins(
                    medecinsRes.data
                );

            } catch(error) {

                console.log(error);

            } finally {

                setLoading(false);
            }
        };

        loadData();

    }, []);

    // RECHERCHE
    const rechercher = async () => {

        try {

            const headers = {
                Authorization: `Bearer ${token}`
            };

            const params = {};

            if(filters.nom.trim()) {
                params.nom = filters.nom;
            }

            if(filters.specialite.trim()) {
                params.specialite =
                    filters.specialite;
            }

            if(filters.lieu.trim()) {
                params.lieu =
                    filters.lieu;
            }

            if(filters.tauxMin !== "") {
                params.tauxMin =
                    filters.tauxMin;
            }

            if(filters.tauxMax !== "") {
                params.tauxMax =
                    filters.tauxMax;
            }

            const res =
                await axios.get(
                    urlMedecins,
                    {
                        headers,
                        params
                    }
                );

            setMedecins(
                res.data
            );

        } catch(error) {

            console.log(error);
        }
    };

    // RECHERCHE AUTOMATIQUE
    useEffect(() => {

        const timer =
            setTimeout(() => {

                rechercher();

            }, 500);

        return () =>
            clearTimeout(timer);

    }, [filters]);

    return (
        <div>

            <NavPatients
                userId={userId}
            />

            <h2>
                Rechercher un médecin
            </h2>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                }}
            >

                <input
                    type="text"
                    placeholder="Nom du médecin"
                    value={filters.nom}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            nom: e.target.value
                        })
                    }
                />

                <input
                    type="text"
                    placeholder="Spécialité"
                    value={filters.specialite}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            specialite:
                                e.target.value
                        })
                    }
                />

                <input
                    type="text"
                    placeholder="Lieu"
                    value={filters.lieu}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            lieu:
                                e.target.value
                        })
                    }
                />

                <input
                    type="number"
                    placeholder="Taux minimum"
                    value={filters.tauxMin}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            tauxMin:
                                e.target.value
                        })
                    }
                />

                <input
                    type="number"
                    placeholder="Taux maximum"
                    value={filters.tauxMax}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            tauxMax:
                                e.target.value
                        })
                    }
                />

            </div>

            <hr />

            {
                profile
                    ? <Profile info={profile}/>
                    : <p>Chargement du profil...</p>
            }

            <hr />

            {
                loading
                    ? (
                        <p>
                            Chargement des médecins...
                        </p>
                    )
                    : (
                        <ListMedecinForPatients
                            medecins={medecins}
                        />
                    )
            }

        </div>
    );
}