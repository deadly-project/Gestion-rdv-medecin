import { useNavigate } from "react-router-dom";
import { BsGeoAlt, BsCash, BsCalendarPlus, BsBookmarkStar } from "react-icons/bs";

export default function ListMedecinForPatients({ medecins }){
    const navigate = useNavigate();
    const role = sessionStorage.getItem("role");

    const handleClickMed = (id) => {
        navigate(`/PriseRdv/${role}/${id}`);
    };

    return(
        <div className="patient-medecins-grid">
            {medecins.length === 0 ? (
                <div className="no-results-box">
                    <p>Aucun médecin ne correspond à vos critères de recherche actuellement.</p>
                </div>
            ) : (
                medecins.map(med => (
                    <div 
                        className="medecin-patient-view-card" 
                        key={med.id_user} 
                        onClick={() => handleClickMed(med.id_user)}
                    >
                        {/* Haut de la carte : Avatar & Nom */}
                        <div className="med-card-top-header">
                            <div className="med-avatar-circle">
                                {med.nom_med ? med.nom_med.charAt(0).toUpperCase() : "M"}
                            </div>
                            <div className="med-meta-identity">
                                <h4>{med.nom_med}</h4>
                                <span className="med-spec-badge">
                                    <BsBookmarkStar style={{ marginRight: '4px' }} /> {med.specialite || "Généraliste"}
                                </span>
                            </div>
                        </div>

                        {/* Corps de la carte : Détails de la consultation */}
                        <div className="med-card-body-details">
                            <div className="med-detail-row">
                                <BsGeoAlt className="detail-icon-marker" />
                                <span>{med.lieu || "Adresse non spécifiée"}</span>
                            </div>
                            <div className="med-detail-row highlight-price">
                                <BsCash className="detail-icon-marker" />
                                <span>{parseInt(med.taux_horaire).toLocaleString('fr-FR')} Ar / heure</span>
                            </div>
                        </div>

                        {/* Bouton d'action bas de carte */}
                        <div className="med-card-footer">
                            <button className="book-appointment-btn">
                                <BsCalendarPlus /> Prendre rendez-vous
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}