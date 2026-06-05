import axios from "axios";
import { useEffect, useState } from "react"

export default function ListRdvMedecin({ rdvs, setRdvs }){
    const urlRdv ="http://localhost:8080/backend/api/rendezvous";
    const token = sessionStorage.getItem("token");

    const validateRdv = async (id) =>{
        const res = await axios.put(
            `${urlRdv}?action=validate&id=${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
            setRdvs(prevRdvs => 
                prevRdvs.map(rdv => rdv.id === id ? { ...rdv, statut: "validated" } : rdv)
            );
        }
    }
    const refuseRdv = async (id) =>{
        const res = await axios.put(
            `${urlRdv}?action=refuse&id=${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
            setRdvs(prevRdvs => 
                prevRdvs.map(rdv => rdv.id === id ? { ...rdv, statut: "refused" } : rdv)
            );
        }
    }
    return(
        <div>
            {
                rdvs.map((rdv) => (
                    <div key={rdv.id}>
                        <h4>{rdv.date_rdv}</h4>
                        <div>
                            {rdv.heure_debut} - {rdv.heure_fin}
                        </div>
                        <div>Patients : {rdv.nom_patient}</div>
                        <div>Date de naissance : {rdv.date_naissance}</div>
                        <div>Motif : {rdv.motif}</div>
                        <div>Statut : {rdv.statut}</div>
                        {rdv.statut === "pending" && (
                        <div>
                            <button
                              onClick={() => validateRdv(rdv.id)}
                            >
                                Valider
                            </button>
                            <button
                              onClick={() => refuseRdv(rdv.id)}
                            >
                                Refuser
                            </button>
                        </div>
                    )}
                    </div>
               )
            )
        }
        </div>
    )
}