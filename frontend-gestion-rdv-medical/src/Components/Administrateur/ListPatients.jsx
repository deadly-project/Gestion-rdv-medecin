import { useEffect, useState } from "react";
import { BsPencilSquare, BsFillTrash3Fill } from "react-icons/bs";
import NavAdmin from "./NavAdmin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/ListMedecins.css";


export default function ListPatients(){
    const [patients, setPatients] = useState([]);
    const userId = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
    
    const profileRaw = sessionStorage.getItem("profile");
    const profile = profileRaw ? JSON.parse(profileRaw) : null;

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8080/backend/api/admin/patients",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setPatients(res.data);
            } catch(err) {
                console.log(err);
            }
        };
        fetchPatients();
    }, []);

    const updatePatient = async (id) => {
        navigate(`/UpdatePatient/admin/${id}`);
    };

    const deletePatient = async (id) => {
        try {
            // 👇 Correction ici : appel de l'endpoint /patients au lieu de /medecins
            await axios.delete(
                `http://localhost:8080/backend/api/admin/patients?id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPatients(patients.filter(pat => pat.id !== id));
        } catch(err) {
            console.log(err);
        }
    };

    const handleClickDelete = async (id) => {
        const boutonConfirme = window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?");
        if (boutonConfirme) {
            deletePatient(id);
        }
    };

    const getStatusClass = (status) => {
        switch(status?.toLowerCase()) {
            case "active": case "actif": case "validated": case "validé": return "status-active";
            case "pending": case "en attente": return "status-pending";
            case "banned": case "bloqué": return "status-banned";
            default: return "status-default";
        }
    };

    // Fonction utilitaire pour rendre la date plus agréable à lire (Ex: 12/05/1995)
    const formatDate = (dateString) => {
        if (!dateString) return "Non renseignée";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("fr-FR");
        } catch (e) {
            return dateString;
        }
    };

    return(
        <div className="admin-container">
            <NavAdmin userId={userId} profile={profile}/>
            
            <div className="view-section">
                <div className="view-header">
                    <div>
                        <h2>Annuaire des Patients</h2>
                        <p className="view-subtitle">Consultez, modifiez ou gérez l'accès des patients de la plateforme.</p>
                    </div>
                    <span className="medecins-count-badge">
                        {patients.length} {patients.length > 1 ? "patients" : "patient"}
                    </span>
                </div>

                {patients.length === 0 ? (
                    <div className="empty-state-box">
                        <p>Aucun patient n'est actuellement inscrit.</p>
                    </div>
                ) : (
                    <div className="medecins-cards-grid">
                        {patients.map(patient => (
                            <div className="medecin-profile-card" key={patient.id}>
                                
                                {/* Ligne supérieure : Statut du compte tout en haut */}
                                <div className="card-top-status-row">
                                    <span className={`card-status-badge ${getStatusClass(patient.user_status)}`}>
                                        ● {patient.user_status === "validated" ? "Validé" : (patient.user_status || "Actif")}
                                    </span>
                                </div>

                                {/* Entête du profil : Initiales & Nom du patient */}
                                <div className="profile-card-top">
                                    <div className="avatar-placeholder patient-avatar-color">
                                        {patient.nom_pat ? patient.nom_pat.charAt(0).toUpperCase() : "P"}
                                    </div>
                                    <div className="profile-main-meta">
                                        <h3>{patient.nom_pat}</h3>
                                        <span className="profile-username">@{patient.username}</span>
                                    </div>
                                </div>

                                {/* Badge pour identifier le type de profil d'un coup d'œil */}
                                <div className="profile-specialite">
                                    <span className="spec-tag patient-tag">Dossier Patient</span>
                                </div>

                                {/* Détails du profil réorganisés */}
                                <div className="profile-card-details">
                                    
                                    {/* Bloc Email sur toute la largeur (Évite les coupures) */}
                                    <div className="detail-block-email">
                                        <span className="detail-label">Adresse email</span>
                                        <span className="detail-value-email">{patient.email}</span>
                                    </div>

                                    {/* Date de naissance */}
                                    <div className="detail-row highlight-row">
                                        <span className="detail-label">Né(e) le :</span>
                                        <span className="detail-value">{formatDate(patient.datenais)}</span>
                                    </div>
                                </div>

                                {/* Barre d'actions en bas de carte */}
                                <div className="profile-card-actions">
                                    <button 
                                        className="action-card-btn edit-btn"
                                        onClick={() => updatePatient(patient.id)}
                                    >
                                        <BsPencilSquare /> Modifier
                                    </button>
                                    <button 
                                        className="action-card-btn delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClickDelete(patient.id);
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