import axios from "axios";
import { useEffect, useState } from "react"
import Profile from "../Common/Profil";
import ListUsers from "./ListUser";
import NavAdmin from "./NavAdmin";
import ClassementMedecin from "./ClassementMedecin";

export default function AdminDashboard({ userId }){
    const urlProfile = "http://localhost:8080/backend/api/profile";
    const urlUsers = "http://localhost:8080/backend/api/admin";
    const urlTop = "http://localhost:8080/backend/api/top-medecins";

    const token = sessionStorage.getItem("token");
    const [profile, setProfile] = useState(null);
    const [users, setUsers] = useState([]);
    const [TopMeds, setTopMeds] = useState([]);


    useEffect(() =>{
        const fetchProfile = async () => {

            try {
                const headers = {
                            Authorization: `Bearer ${token}`
                        };
                const [profileRes, topRes] = await Promise.all([
                    axios.get(
                        urlProfile,
                        { headers }
                    ),
                    axios.get(
                        urlTop,
                        { headers }
                    )
                ]
                );


                sessionStorage.setItem("profile", JSON.stringify(profileRes.data));
                setProfile(profileRes.data);
                setTopMeds(topRes.data);
            } catch(err) {

                console.log(err);
            }
        };

        fetchProfile();
    }, []);
    return(
        <div className="dashboard-container">
            <NavAdmin userId={userId} profile={profile}/>
            {/* { users.length > 0 ? <ListUsers Users={users}/> :<p>Chargement des utilisateur</p> } */}
            { TopMeds ? <ClassementMedecin TopMeds={TopMeds}/>:<p>Aucun medecin</p>}
        </div>
    )
}