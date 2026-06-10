import axios from "axios";
import { useEffect, useState } from "react";
import { BsSearch, BsGeoAlt, BsAward, BsCashStack } from "react-icons/bs";

export default function RechercheMedecin({ setMedecins }){
    const token = sessionStorage.getItem("token");
    const urlMedecins = "http://localhost:8080/backend/api/medecins";
    
    const [filters, setFilters] = useState({
        nom: "",
        specialite: "",
        lieu: "",
        tauxMin: "",
        tauxMax: ""
    });

    const rechercher = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const params = {};

            if(filters.nom.trim()) params.nom = filters.nom;
            if(filters.specialite.trim()) params.specialite = filters.specialite;
            if(filters.lieu.trim()) params.lieu = filters.lieu;
            if(filters.tauxMin !== "") params.tauxMin = filters.tauxMin;
            if(filters.tauxMax !== "") params.tauxMax = filters.tauxMax;

            const res = await axios.get(urlMedecins, { headers, params });
            setMedecins(res.data);
        } catch(error) {
            console.log(error);
        }
    };

    // Recherche automatique avec Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            rechercher();
        }, 500); // 400ms ou 500ms est idéal pour ne pas surcharger l'API pendant la saisie

        return () => clearTimeout(timer);
    }, [filters]);

    return(
        <div className="search-filter-card">
            <div className="search-grid-inputs">
                
                {/* Filtre Nom */}
                <div className="search-input-wrapper">
                    <BsSearch className="input-icon" />
                    <input
                        type="text"
                        placeholder="Nom du médecin..."
                        value={filters.nom}
                        onChange={(e) => setFilters({ ...filters, nom: e.target.value })}
                    />
                </div>

                {/* Filtre Spécialité */}
                <div className="search-input-wrapper">
                    <BsAward className="input-icon" />
                    <input
                        type="text"
                        placeholder="Spécialité (Ex: Cardiologue)..."
                        value={filters.specialite}
                        onChange={(e) => setFilters({ ...filters, specialite: e.target.value })}
                    />
                </div>

                {/* Filtre Lieu */}
                <div className="search-input-wrapper">
                    <BsGeoAlt className="input-icon" />
                    <input
                        type="text"
                        placeholder="Lieu / Ville..."
                        value={filters.lieu}
                        onChange={(e) => setFilters({ ...filters, lieu: e.target.value })}
                    />
                </div>

                {/* Filtres de prix de prestations côte à côte */}
                <div className="search-range-wrapper">
                    <div className="range-field">
                        <BsCashStack className="input-icon" />
                        <input
                            type="number"
                            placeholder="Min (Ar)"
                            value={filters.tauxMin}
                            onChange={(e) => setFilters({ ...filters, tauxMin: e.target.value })}
                        />
                    </div>
                    <div className="range-divider">à</div>
                    <div className="range-field">
                        <input
                            type="number"
                            placeholder="Max (Ar)"
                            value={filters.tauxMax}
                            onChange={(e) => setFilters({ ...filters, tauxMax: e.target.value })}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}