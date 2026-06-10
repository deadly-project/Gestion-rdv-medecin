import axios from "axios";
import { useEffect, useState } from "react";
import "../../css/ClassementMedecins.css";
import { FaMedal, FaMapMarkerAlt, FaStethoscope, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ClassementMedecin({ TopMeds }){
    // État pour savoir à quel index de médecin on commence l'affichage
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 5;

    // Calcul des médecins à afficher pour la page actuelle
    const displayedMeds = TopMeds.slice(currentIndex, currentIndex + itemsPerPage);

    // Fonctions pour changer de page
    const handleNext = () => {
        if (currentIndex + itemsPerPage < TopMeds.length) {
            setCurrentIndex(currentIndex + itemsPerPage);
        }
    };

    const handlePrev = () => {
        if (currentIndex - itemsPerPage >= 0) {
            setCurrentIndex(currentIndex - itemsPerPage);
        }
    };

    return(
        <div className="modern-ranking-container">
            <div className="ranking-header-container">
                <div className="ranking-header">
                    <h2>Médecins Stars</h2>
                    <p>Affichage des praticiens {currentIndex + 1} à {Math.min(currentIndex + itemsPerPage, TopMeds.length)} sur {TopMeds.length}</p>
                </div>
                
                {/* Boutons de navigation Gauche / Droite */}
                <div className="ranking-navigation">
                    <button 
                        onClick={handlePrev} 
                        className="nav-btn" 
                        disabled={currentIndex === 0}
                        title="Précédent"
                    >
                        <FaChevronLeft />
                    </button>
                    <button 
                        onClick={handleNext} 
                        className="nav-btn" 
                        disabled={currentIndex + itemsPerPage >= TopMeds.length}
                        title="Suivant"
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>

            <div className="ranking-list">
                {displayedMeds.map((med, index) => {
                    // Calcul du vrai rang global (ex: 6, 7, 8... en page 2)
                    const globalIndex = currentIndex + index; 
                    
                    return (
                        <div key={med.idMedecin} className="ranking-row">
                            {/* Indicateur de position (Rang global) */}
                            <div className={`rank-badge rank-${globalIndex + 1}`}>
                                {globalIndex < 3 ? <FaMedal /> : globalIndex + 1}
                            </div>

                            {/* Informations principales */}
                            <div className="med-main-info">
                                <div className="med-avatar">
                                    {med.nomMed.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="med-name">{med.nomMed}</h3>
                                    <span className="med-specialty">
                                        <FaStethoscope className="icon-inline" /> {med.Specialite}
                                    </span>
                                </div>
                            </div>

                            {/* Localisation */}
                            <div className="med-location">
                                <FaMapMarkerAlt className="icon-inline" /> {med.lieu}
                            </div>

                            {/* Tarification */}
                            <div className="med-pricing">
                                <span className="price-tag">{med.tauxHoraire} Ar</span>
                                <span className="price-label">/ consultation</span>
                            </div>

                            {/* Compteur d'activité */}
                            <div className="med-stats">
                                <span className="stats-number">{med.nombreConsultations}</span>
                                <span className="stats-label">consultations</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )   
}