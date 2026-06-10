import { useEffect, useState } from "react";
import NavPatients from "./NavPatients";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BsCalendarEvent, BsClock, BsGeoAlt, BsFileText, BsFunnel, BsXCircle } from "react-icons/bs";
import "../../css/ListRdvPatient.css"; // Nouveau fichier CSS

export default function ListRdvPatient(){
    const [rdvs, setRdvs] = useState([]);
    const { role, id } = useParams();
    const token = sessionStorage.getItem("token");    
    const [statutFilter, setStatutFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");

    const profileRaw = sessionStorage.getItem("profile");
    const profile = profileRaw ? JSON.parse(profileRaw) : null;

    // ANNULATION DU RDV (Harmonisé avec Axios)
    const cancelRdv = async (rdvId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) return;

        try {
            const res = await axios.delete(
                `http://localhost:8080/backend/api/rendezvous?id=${rdvId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Si ton backend renvoie res.data.success ou simplement un statut HTTP 200
            if (res.status === 200 || res.data.success) {
                setRdvs(prev =>
                    prev.map(r => r.id === rdvId ? { ...r, statut: "cancelled" } : r)
                );
            }
        } catch (err) {
            console.log(err);
            alert("Erreur lors de l'annulation du rendez-vous.");
        }
    };

    // FILTRAGE LOGIQUE (Prend en compte rdv.statut ou rdv.status de ton API)
    const filteredRdvs = rdvs.filter(rdv => {
        const currentStatut = rdv.statut || rdv.status || "pending";
        const statutOk = statutFilter === "all" || currentStatut === statutFilter;
        const dateOk = !dateFilter || rdv.date_rdv === dateFilter;
        return statutOk && dateOk;
    });

    useEffect(() => {
        const fetchRdvs = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8080/backend/api/rendezvous",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setRdvs(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchRdvs();
    }, [token]);

    // Formate la date pour l'affichage textuel en français
    const formatDateFr = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Helper pour générer le libellé et la classe du Badge de Statut
    const getStatutBadge = (statut) => {
        switch (statut) {
            case "validated": return { text: "Validé", className: "badge-validated" };
            case "refused": return { text: "Refusé", className: "badge-refused" };
            case "cancelled": return { text: "Annulé", className: "badge-cancelled" };
            default: return { text: "En attente", className: "badge-pending" };
        }
    };

    return(
        <div className="rdv-list-page">
            <NavPatients userId={id} profile={profile}/>
            
            <div className="rdv-list-header">
                <h2>Vos Rendez-vous</h2>
                <p>Retrouvez ici l'ensemble de vos consultations médicales programmées et passées.</p>
            </div>

            {/* BARRE DE FILTRES STYLE TOOLBAR */}
            <div className="rdv-filter-toolbar">
                <div className="filter-title">
                    <BsFunnel /> <span>Filtrer par :</span>
                </div>
                
                <div className="filter-controls">
                    <select 
                        value={statutFilter}
                        onChange={e => setStatutFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="validated">Validés</option>
                        <option value="refused">Refusés</option>
                        <option value="cancelled">Annulés</option>
                    </select>

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={e => setDateFilter(e.target.value)}
                        className="filter-date-input"
                    />
                </div>
            </div>

            {/* LISTE DES CARTES */}
            <div className="rdv-cards-wrapper">
                {filteredRdvs.length > 0 ? (
                    filteredRdvs.map(rdv => {
                        const badge = getStatutBadge(rdv.statut || rdv.status);
                        const isPending = (rdv.statut || rdv.status) === "pending";

                        return (
                            <div key={rdv.id} className={`rdv-item-card ${badge.className}-border`}>
                                
                                {/* Header interne de la carte : Date et Statut */}
                                <div className="rdv-card-top-row">
                                    <div className="rdv-date-title">
                                        <BsCalendarEvent className="rdv-card-icon-main" />
                                        <h4>{formatDateFr(rdv.date_rdv)}</h4>
                                    </div>
                                    <span className={`rdv-status-badge ${badge.className}`}>
                                        {badge.text}
                                    </span>
                                </div>

                                {/* Contenu principal : Médecin et Horaire */}
                                <div className="rdv-card-main-body">
                                    <div className="rdv-medecin-info-block">
                                        <h5>Dr. {rdv.nom_medecin}</h5>
                                        <span className="rdv-med-spec">{rdv.specialite || "Médecin Généraliste"}</span>
                                    </div>

                                    <div className="rdv-details-grid-meta">
                                        <div className="meta-item">
                                            <BsClock className="meta-icon" />
                                            <span>{rdv.heure_debut?.substring(0,5)} - {rdv.heure_fin?.substring(0,5)}</span>
                                        </div>
                                        <div className="meta-item">
                                            <BsGeoAlt className="meta-icon" />
                                            <span>{rdv.lieu || "Cabinet Médical"}</span>
                                        </div>
                                        <div className="meta-item price-tag">
                                            <span>{parseInt(rdv.taux_horaire).toLocaleString('fr-FR')} Ar / h</span>
                                        </div>
                                    </div>

                                    {rdv.motif && (
                                        <div className="rdv-motif-container-box">
                                            <BsFileText className="motif-icon" />
                                            <p><strong>Motif :</strong> {rdv.motif}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer de carte avec action contextuelle d'annulation */}
                                {isPending && (
                                    <div className="rdv-card-action-footer">
                                        <button className="rdv-btn-cancel" onClick={() => cancelRdv(rdv.id)}>
                                            <BsXCircle /> Annuler le rendez-vous
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="rdv-empty-state-card">
                        <p>Aucun rendez-vous ne correspond à ces critères.</p>
                    </div>
                )}
            </div>
        </div>
    );
}