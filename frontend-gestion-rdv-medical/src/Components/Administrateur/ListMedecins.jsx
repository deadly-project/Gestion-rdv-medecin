import { useEffect, useState } from "react";
import { BsPencilSquare, BsFillTrash3Fill } from "react-icons/bs";
import NavAdmin from "./NavAdmin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/ListMedecins.css";

export default function ListMedecins(){
    const navigate = useNavigate();
    const [medecins, setMedecins] = useState([]);
    const userId = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");
    
    const profileRaw = sessionStorage.getItem("profile");
    const profile = profileRaw ? JSON.parse(profileRaw) : null;

    useEffect(() => {
        const fetchMedecins = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8080/backend/api/admin/medecins",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setMedecins(res.data);
            } catch(err) {
                console.log(err);
            }
        };
        
        fetchMedecins();
    }, []);

    const updateMedecin = async (id) => {
        navigate(`/UpdateMedecin/admin/${id}`);
    };

    const deleteMedecin = async (id) => {
        try {
            await axios.delete(
                `http://localhost:8080/backend/api/admin/medecins?id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMedecins(medecins.filter(med => med.id !== id));
        } catch(err) {
            console.log(err);
        }
    };

    const handleClickDelete = async (id) => {
        const boutonConfirme = window.confirm("Êtes-vous sûr de vouloir supprimer ce médecin ?");
        if (boutonConfirme) {
            deleteMedecin(id);
        }
    };

    const getStatusClass = (status) => {
        switch(status?.toLowerCase()) {
            case "active": case "actif": case "validé": return "status-active";
            case "pending": case "en attente": return "status-pending";
            case "banned": case "bloqué": return "status-banned";
            default: return "status-default";
        }
    };

    return(
        <div className="admin-container">
            <NavAdmin userId={userId} profile={profile}/>
            
            <div className="view-section">
                <div className="view-header">
                    <div>
                        <h2>Annuaire des Médecins</h2>
                        <p className="view-subtitle">Gérez et suivez le statut de l'ensemble du personnel médical.</p>
                    </div>
                    <span className="medecins-count-badge">
                        {medecins.length} {medecins.length > 1 ? "médecins" : "médecin"}
                    </span>
                </div>

                {medecins.length === 0 ? (
                    <div className="empty-state-box">
                        <p>Aucun médecin n'est actuellement inscrit sur la plateforme.</p>
                    </div>
                ) : (
                    <div className="medecins-cards-grid">
                        {medecins.map(med => (
                            <div className="medecin-profile-card" key={med.id}>
                                
                                {/* Ligne supérieure : Statut du compte tout en haut */}
                                <div className="card-top-status-row">
                                    <span className={`card-status-badge ${getStatusClass(med.user_status)}`}>
                                        ● {med.user_status || "Actif"}
                                    </span>
                                </div>

                                {/* Entête du profil : Avatar et Nom */}
                                <div className="profile-card-top">
                                    <div className="avatar-placeholder">
                                        {med.nom_med ? med.nom_med.charAt(0).toUpperCase() : "M"}
                                    </div>
                                    <div className="profile-main-meta">
                                        <h3>{med.nom_med}</h3>
                                        <span className="profile-username">@{med.username}</span>
                                    </div>
                                </div>

                                {/* Spécialité */}
                                <div className="profile-specialite">
                                    <span className="spec-tag">{med.specialite || "Généraliste"}</span>
                                </div>

                                {/* Détails du profil réorganisés */}
                                <div className="profile-card-details">
                                    
                                    {/* Bloc Email sur toute la largeur pour éviter les coupures */}
                                    <div className="detail-block-email">
                                        <span className="detail-label">Adresse email</span>
                                        <span className="detail-value-email">{med.email}</span>
                                    </div>

                                    <div className="detail-row">
                                        <span className="detail-label">Cabinet :</span>
                                        <span className="detail-value">{med.lieu || "Non renseigné"}</span>
                                    </div>
                                    
                                    <div className="detail-row highlight-row">
                                        <span className="detail-label">Taux horaire :</span>
                                        <span className="detail-value price">{med.taux_horaire} Ar/h</span>
                                    </div>
                                </div>

                                {/* Barre d'actions */}
                                <div className="profile-card-actions">
                                    <button 
                                        className="action-card-btn edit-btn"
                                        onClick={() => updateMedecin(med.id)}
                                    >
                                        <BsPencilSquare /> Modifier
                                    </button>
                                    <button 
                                        className="action-card-btn delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClickDelete(med.id);
                                        }}
                                    >
                                        <BsFillTrash3Fill /> Supprimer
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}