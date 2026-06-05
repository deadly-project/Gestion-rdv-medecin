import axios from "axios";
import { useEffect, useState } from "react"

export default function ClassementMedecin({ TopMeds }){
    return(
        <div>
            <h2>TOP 5 DES MEDECINS LES PLUS CONSULTER</h2>
            {
                TopMeds.map(med =>(
                    <div key={med.idMedecin}>
                        <div>
                            {med.nomMed}
                        </div>
                        <div>
                            {med.Specialite}
                        </div>
                        <div>
                            {med.lieu}
                        </div>
                        <div>
                            {med.tauxHoraire}
                        </div>
                        <div>
                            {med.nombreConsultations}
                        </div>
                    </div>
                ))
            }
        </div>
    )   
}