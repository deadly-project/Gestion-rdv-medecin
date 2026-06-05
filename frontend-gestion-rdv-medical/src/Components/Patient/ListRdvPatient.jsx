import { useEffect, useState } from "react"
import NavPatients from "./NavPatients";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ListRdvPatient(){
    const [rdvs, setRdvs] = useState([]);
    const {role, id} = useParams();
    const token = sessionStorage.getItem("token");    
    const [statutFilter,setStatutFilter] = useState("all");

    const [dateFilter,setDateFilter] = useState("");

    const cancelRdv = async (id) => {

        try{
            const res = await fetch(
                `http://localhost:8080/backend/api/rendezvous?id=${id}`,
                {
                    method:"DELETE",
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if(data.success){

                setRdvs(
                    prev =>
                        prev.map(
                            r =>r.id === id ? {...r,statut:"cancelled"} : r
                        )
                );
            }

        }catch(err){

            console.log(err);
        }
    };

    const filteredRdvs =
        rdvs.filter(rdv => {
            const statutOk = statutFilter === "all"|| rdv.statut === statutFilter;
            const dateOk =!dateFilter || rdv.date_rdv === dateFilter;
            return statutOk && dateOk;
        });


    useEffect(() => {
        const fetchRdvs = async () => {
            const res = await axios.get(
                "http://localhost:8080/backend/api/rendezvous",
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );

            setRdvs(res.data);
        };

        fetchRdvs();

    }, []);

    return(
        <div>
            <NavPatients userId={id} />
            <h3>Filtres</h3>

            <select 
                value={statutFilter}
                onChange={
                    e =>
                    setStatutFilter(
                        e.target.value
                    )
                }
            >
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="validated">Validés</option>
                <option value="refused">Refusés</option>
                <option value="cancelled">Annulés</option>
            </select>

            <input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)
                }
            />

            <hr/>

            {filteredRdvs.length > 0 ?
                filteredRdvs.map(
                    rdv => (
                        <div key={rdv.id}>
                            <h4>{rdv.date_rdv}</h4>
                            <div>{rdv.heure_debut}{" - "}{rdv.heure_fin}</div>
                            <div>Medecin :{" "}{rdv.nom_medecin}</div>
                            <div>Specialité :{" "}{rdv.specialite}</div>
                            <div>lieu :{" "}{rdv.lieu}</div>
                            <div>Taux horaire :{" "}{rdv.taux_horaire} ar / heure</div>
                            <div>Motif :{" "}{rdv.motif}</div>

                            <div>Statut :{" "}{rdv.statut}</div>
                            {
                                rdv.statut === "pending"
                                &&
                                (
                                    <button onClick={() =>cancelRdv(rdv.id)}>
                                        Annuler
                                    </button>
                                )
                            }
                        </div>
                    )
                ) :
                
                <p>Aucun rendez-vous</p>
            }
        </div>
    );
}