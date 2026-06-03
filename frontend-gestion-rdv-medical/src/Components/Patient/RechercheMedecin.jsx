import axios from "axios";
import { useEffect, useState } from "react";

export default function RechercheMedecin({ setMedecins }){

    const token = localStorage.getItem("token");
    const urlMedecins =
        "http://localhost:8080/backend/api/medecins";
    const [filters, setFilters] = useState({
        nom: "",
        specialite: "",
        lieu: "",
        tauxMin: "",
        tauxMax: ""
    });

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
    return(
        <div>

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
        </div>
    )
}