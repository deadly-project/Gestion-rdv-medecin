import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { BsFillTrash3Fill } from "react-icons/bs";
import NavAdmin from "./NavAdmin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function ListPatients(){
    const [patients, setPatients] = useState([]);
    const userId = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
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

    const updatePatient = async (id) =>{
        navigate(`/UpdatePatient/admin/${id}`)
    }


    const deletePatient = async (id) => {
        try {

            await axios.delete(
                `http://localhost:8080/backend/api/admin/medecins?id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPatients(
                patients.filter(
                    pat => pat.id !== id
                )
            );

        } catch(err) {

            console.log(err);
        }
    };

    const handleClickDelete = async (id) =>{
        const boutonConfirme = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
        if (boutonConfirme) {
            deletePatient(id);
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
                        <th>Date de naissance</th>
                        <th>Status</th> 
                    </tr>
                </thead>
                <tbody>
                    {
                        patients.map(patient => (
                            <tr key={patient.id}>
                            
                                <td>{patient.nom_pat}</td>
                        
                                <td>{patient.username}</td>
                        
                                <td>{patient.email}</td>
                        
                                <td>{patient.datenais}</td>
                        
                                <td>{patient.user_status}</td>
                        
                                <td>
                                    <BsPencilSquare onClick={() =>{
                                        updatePatient(patient.id)
                                    }}/>
                                    <BsFillTrash3Fill onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickDelete(patient.id)
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