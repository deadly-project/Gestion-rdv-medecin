import axios from "axios";
import { useEffect, useState } from "react";
import NavPatients from "./NavPatients";
import ListMedecinForPatients from "./ListMedecinForPatients";
import RechercheMedecin from "./RechercheMedecin";
import { BsSearch } from "react-icons/bs";
import "../../css/PatientDashboard.css"; // Fichier CSS unifié

export default function PatientDashboard({ userId }) {
    const token = sessionStorage.getItem("token");

    const urlProfile = "http://localhost:8080/backend/api/profile";
    const urlMedecins = "http://localhost:8080/backend/api/medecins";

    const [profile, setProfile] = useState(null);
    const [medecins, setMedecins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };

                const [profileRes, medecinsRes] = await Promise.all([
                    axios.get(urlProfile, { headers }),
                    axios.get(urlMedecins, { headers })
                ]);

                sessionStorage.setItem("profile", JSON.stringify(profileRes.data));
                setProfile(profileRes.data);
                setMedecins(medecinsRes.data);
            } catch(error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className="patient-dashboard-container">
            <NavPatients userId={userId} profile={profile} />

            <div className="dashboard-hero-section">
                <h2>Bonjour, {profile ? profile.username : "Patient"} 👋</h2>
                <p>Trouvez un medecin et planifiez votre prochaine consultation en quelques clics.</p>
            </div>

            {/* Section Recherche / Filtres */}
            <RechercheMedecin setMedecins={setMedecins}/>

            {/* Section Résultats */}
            <div className="results-section-wrapper">
                <div className="section-title-row">
                    <h3>Médecins disponibles</h3>
                    <span className="results-counter">{medecins.length} Medecins trouvés</span>
                </div>

                {loading ? (
                    <div className="loading-spinner-box">
                        <div className="spinner"></div>
                        <p>Chargement des médecins disponibles...</p>
                    </div>
                ) : (
                    <ListMedecinForPatients medecins={medecins} />
                )}
            </div>
        </div>
    );
}