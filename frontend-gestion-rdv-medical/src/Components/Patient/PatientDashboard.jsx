import axios from "axios";
import { useEffect, useState } from "react";

import Profile from "../Common/Profil";
import NavPatients from "./NavPatients";
import ListMedecinForPatients from "./ListMedecinForPatients";
import RechercheMedecin from "./RechercheMedecin";

export default function PatientDashboard({ userId }) {

    const token = localStorage.getItem("token");

    const urlProfile =
        "http://localhost:8080/backend/api/profile";

    const urlMedecins =
        "http://localhost:8080/backend/api/medecins";

    const [profile, setProfile] =
        useState(null);

    const [medecins, setMedecins] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    // CHARGEMENT INITIAL
    useEffect(() => {

        const loadData = async () => {

            try {

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const [profileRes, medecinsRes] =
                    await Promise.all([
                        axios.get(
                            urlProfile,
                            { headers }
                        ),

                        axios.get(
                            urlMedecins,
                            { headers }
                        )
                    ]);

                setProfile(
                    profileRes.data
                );

                setMedecins(
                    medecinsRes.data
                );

            } catch(error) {

                console.log(error);

            } finally {

                setLoading(false);
            }
        };

        loadData();

    }, []);


    return (
        <div>

            <NavPatients
                userId={userId}
            />

            <RechercheMedecin setMedecins={setMedecins}/>

            {
                profile
                    ? <Profile info={profile}/>
                    : <p>Chargement du profil...</p>
            }

            <hr />

            {
                loading
                    ? (
                        <p>
                            Chargement des médecins...
                        </p>
                    )
                    : (
                        <ListMedecinForPatients
                            medecins={medecins}
                        />
                    )
            }

        </div>
    );
}