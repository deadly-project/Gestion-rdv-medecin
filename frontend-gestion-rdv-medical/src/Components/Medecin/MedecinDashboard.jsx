import axios from "axios";
import { useEffect, useState } from "react";
import Profile from "../Common/Profil";
import NavMedecin from "./NavMedecin";
import ListRdvMedecin from "./ListRdvMedecin";
import FiltreRdvMedecin from "./FiltreRdvMedecin";

export default function MedecinDashboard({ userId }){
    const urlProfile = "http://localhost:8080/backend/api/profile";
    const urlRdv ="http://localhost:8080/backend/api/rendezvous";

    const token = sessionStorage.getItem("token");
    const [profile, setProfile] = useState(null);
    const [rdvs, setRdvs] = useState(null);

    useEffect(() =>{
        const fetchProfile = async () => {

            try {
                const headers = 
                        {
                            Authorization: `Bearer ${token}`
                        };
                const [profileRes, rdvsRes] = await Promise.all([
                    axios.get(
                        urlProfile,
                        { headers }
                    ),
                    axios.get(
                        urlRdv,
                        { headers }
                    )
                ]
                );

                setProfile(profileRes.data);
                setRdvs(rdvsRes.data);

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
            {
    rdvs
        ? (
            <FiltreRdvMedecin
                rdvs={rdvs}
                setRdvs={setRdvs}
            />
        )
        : (
            <p>
                Chargement des rendez-vous...
            </p>
        )
}
        </div>
    )
}