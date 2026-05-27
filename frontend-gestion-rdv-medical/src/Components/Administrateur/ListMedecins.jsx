import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { BsFillTrash3Fill } from "react-icons/bs";
import NavAdmin from "./NavAdmin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function ListMedecins(){
    const navigate = useNavigate();
    const [medecins, setMedecins] = useState([]);
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

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
        navigate(`/UpdateMedecin/admin/${id}`)
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

            setMedecins(
                medecins.filter(
                    med => med.id !== id
                )
            );

        } catch(err) {

            console.log(err);
        }
    };

    const handleClickDelete = async (id) =>{
        const boutonConfirme = window.confirm("Êtes-vous sûr de vouloir supprimer ce médecin ?");
        if (boutonConfirme) {
            deleteMedecin(id);
        }
    
    }

    return(
        <div>
            <NavAdmin userId={userId} />
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Specialité</th>
                        <th>Taux horaire</th>
                        <th>Lieu</th>
                        <th>Status</th> 
                    </tr>
                </thead>
                <tbody>
                    {
                        medecins.map(med => (
                            <tr key={med.id}>
                            
                                <td>{med.nom_med}</td>
                        
                                <td>{med.username}</td>
                        
                                <td>{med.email}</td>
                        
                                <td>{med.specialite}</td>
                        
                                <td>{med.taux_horaire}</td>

                                <td>{med.lieu}</td>

                                <td>{med.user_status}</td>

                                <td>
                                    <BsPencilSquare onClick={() =>{
                                        updateMedecin(med.id)
                                    }}/>

                                    <BsFillTrash3Fill onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickDelete(med.id)
                                        }}/>
                                </td>                        
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}