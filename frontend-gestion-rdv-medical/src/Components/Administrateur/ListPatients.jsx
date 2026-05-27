import { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { BsFillTrash3Fill } from "react-icons/bs";
import NavAdmin from "./NavAdmin";
export default function ListPatients(){
    const [patients, setPatients] = useState([]);
    const userId = localStorage.getItem("id");

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
                            <div key={patient.id}>
                            
                                <td>{patient.nom_pat}</td>
                        
                                <td>{patient.username}</td>
                        
                                <td>{patient.email}</td>
                        
                                <td>{patient.datenais}</td>
                        
                                <td>{patient.user_status}</td>
                        
                                <td>
                                    <BsPencilSquare/>
                                    <BsFillTrash3Fill/>

                                </td>
                            </div>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}