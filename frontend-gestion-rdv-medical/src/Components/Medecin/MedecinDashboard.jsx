import axios from "axios";
import { useEffect, useState } from "react";
import Profile from "../Common/Profil";
import NavMedecin from "./NavMedecin";

export default function MedecinDashboard({ userId }){
    const urlProfile = "http://localhost:8080/backend/api/profile";
    const token = localStorage.getItem("token");
    const [profile, setProfile] = useState(null);
    useEffect(() =>{
        const fetchProfile = async () => {

            try {
                console.log("Token envoyé" + token);
                const res = await axios.get(
                    urlProfile,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(res.data);

                setProfile(res.data);

            } catch(err) {

                console.log(err);
            }
        };

        fetchProfile();
    }, []);
    return(
        <div>
            <NavMedecin userId={userId}/>
            { profile ? <Profile info={profile}/> :<p>Chargement du profile</p> }
        </div>
    )
}