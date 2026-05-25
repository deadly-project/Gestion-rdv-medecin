import { useParams } from "react-router-dom"
import PatientDashboard from "./Patient/PatientDashboard";
import MedecinDashboard from "./Medecin/MedecinDashboard";
import AdminDashboard from "./Administrateur/AdminDashboard";
export default function Dashboard(){
    const {role, id} = useParams();
    if(role == "medecin"){
        return <MedecinDashboard userId={id}/>
    }
    else if(role == "client"){
        return <PatientDashboard userId={id}/>
    }
    else if(role == "admin"){
        return <AdminDashboard userId={id}/>
    }
}