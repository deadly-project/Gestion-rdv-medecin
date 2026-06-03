import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function ListMedecinForPatients({ medecins }){
    const navigate = useNavigate();
    const role = localStorage.getItem("role")
    const handleClickMed = (id) =>{
        navigate(`/PriseRdv/${role}/${id}`);
    }
    return(
        <div className="List-Medecin-For-Patient">
            {
            medecins.map(med => (
                <div key={med.id} onClick={() =>{ handleClickMed(med.id) }}>
                    <div>{med.nom_med}</div>
                    <div>Specialité : {med.specialite}</div>
                    <div>Prestation : {med.taux_horaire} ar/hr</div>
                    <div>Lieu : {med.lieu}</div>
                </div>
            ))
        }
        </div>
    )
}