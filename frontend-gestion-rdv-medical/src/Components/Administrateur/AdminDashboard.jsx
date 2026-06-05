import axios from "axios";
import { useEffect, useState } from "react"
import Profile from "../Common/Profil";
import ListUsers from "./ListUser";
import NavAdmin from "./NavAdmin";

export default function AdminDashboard({ userId }){
    const urlProfile = "http://localhost:8080/backend/api/profile";
    const urlUsers = "http://localhost:8080/backend/api/admin";
    const token = sessionStorage.getItem("token");
    const [profile, setProfile] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() =>{
        const fetchProfile = async () => {

            try {
                const headers = {
                            Authorization: `Bearer ${token}`
                        };
                const [profileRes, usersRes] = await Promise.all([
                    axios.get(
                        urlProfile,
                        { headers }
                    ),
                    axios.get(
                        urlUsers,
                        { headers }
                    )
                ]
                );



                setProfile(profileRes.data);
                setUsers(usersRes.data);
            } catch(err) {

                console.log(err);
            }
        };

        fetchProfile();
    }, []);
    return(
        <div>
            <NavAdmin userId={userId} />
            { profile ? <Profile info={profile}/> :<p>Chargement du profile</p> }
            { users.length > 0 ? <ListUsers Users={users}/> :<p>Chargement des utilisateur</p> }
        </div>
    )
}