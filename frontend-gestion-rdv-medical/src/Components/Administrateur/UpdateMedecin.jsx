import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavAdmin from "./NavAdmin";
import NavMedecin from "../Medecin/NavMedecin";
export default function UpdateMedecin() {
    const {role, id} = useParams();
    const idUserConnected = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");
    const userRoleConnected = sessionStorage.getItem("role");

    const usernameModified = useRef(false);
    const originalUsername = useRef("");

    const [userinfo, setUserinfo] = useState({
        id: id,
        nom_med: "",
        username: "",
        email: "",
        specialite: "",
        taux_horaire: 0,
        lieu: "",
        user_status: "pending"
    });

    const [alert, setAlert] = useState({
        alertUsername: "",
        resultatUsername: false,
        alertAll: ""
    });

    const urlUpdate =
        "http://localhost:8080/backend/api/admin/medecins";

    const urlGet =
        "http://localhost:8080/backend/api/admin/medecins";

    const urlVerification =
        "http://localhost:8080/backend/register";

    // LOAD DATA
    useEffect(() => {

        const fetchMedecin = async () => {

            try {

                const res = await axios.get(
                    `${urlGet}?id=${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const usernameCharge = res.data.username || "";
                // 👇 mémoriser l'username original
                originalUsername.current = usernameCharge;
                console.log(res.data);

                setUserinfo({
                    id: res.data.id,
                    nom_med: res.data.nom_med || "",
                    username: res.data.username || "",
                    email: res.data.email || "",
                    specialite: res.data.specialite || "",
                    taux_horaire: res.data.taux_horaire || 0,
                    lieu: res.data.lieu || "",
                    user_status: res.data.user_status || "pending"
                });

            } catch(err) {

                console.log(err);
            }
        };

        fetchMedecin();

    }, [id]);
// VERIFICATION USERNAME
    useEffect(() => {

        // 👇 Ne pas vérifier si l'username n'a pas été modifié manuellement
        if (!usernameModified.current) return;

        if (!userinfo.username) return;

        if (userinfo.username.length <= 2) {
            setAlert(prev => ({
                ...prev,
                alertUsername: "L'username doit être plus de 2 caractères !"
            }));
            return;
        }

        // 👇 Si l'username est identique à l'original, pas besoin de vérifier
        if (userinfo.username === originalUsername.current) {
            setAlert(prev => ({
                ...prev,
                alertUsername: "",
                resultatUsername: true
            }));
            return;
        }

        setAlert(prev => ({ ...prev, alertUsername: "Verification ..." }));

        const verificationUsername = setTimeout(async () => {
            try {
                const res = await axios.get(
                    `${urlVerification}/${userinfo.username}`
                );
                setAlert(prev => ({
                    ...prev,
                    resultatUsername: res.data.available,
                    alertUsername: res.data.message
                }));
            } catch(error) {
                console.log(error);
            }
        }, 1000);

        return () => clearTimeout(verificationUsername);

    }, [userinfo.username]);

    // UPDATE
    const handleClickSave = async () => {
        try {
            const response = await axios.put(urlUpdate, userinfo, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(response.data);
            originalUsername.current = userinfo.username; // 👈 mettre à jour l'original après save
            usernameModified.current = false;             // 👈 reset
            setAlert(prev => ({ ...prev, alertAll: "Modification réussie" }));

        } catch (error) {
            console.log(error);
            setAlert(prev => ({ ...prev, alertAll: "Erreur lors de la modification" }));
        }
    };

    const dispoUsername = (e) => {
        return e ? "green" : "red";
    };

    return (
        <div>
            {
                role == "admin" ? 
                <NavAdmin userId={idUserConnected}/>
                :
                <NavMedecin userId={id}/>
            }
            <div className="formulaire-update-medecin">

                <h2>Mise à jour du compte</h2>

                <label>Nom complet</label>

                <input
                    type="text"
                    value={userinfo.nom_med}
                    onChange={e =>
                        setUserinfo({
                            ...userinfo,
                            nom_med: e.target.value
                        })
                    }
                />

                <label>Username</label>
                <input
                    type="text"
                    value={userinfo.username}
                    onChange={e => {
                        usernameModified.current = true; // 👈 marquer comme modifié manuellement
                        setUserinfo({ ...userinfo, username: e.target.value });
                    }}
                />

                {
                    alert.alertUsername &&
                    (
                        <div
                            style={{
                                color: dispoUsername(
                                    alert.resultatUsername
                                )
                            }}
                        >
                            {alert.alertUsername}
                        </div>
                    )
                }

                <label>Email</label>

                <input
                    type="text"
                    value={userinfo.email}
                    onChange={e =>
                        setUserinfo({
                            ...userinfo,
                            email: e.target.value
                        })
                    }
                />

                <label>Spécialité</label>

                <input
                    type="text"
                    value={userinfo.specialite}
                    onChange={e =>
                        setUserinfo({
                            ...userinfo,
                            specialite: e.target.value
                        })
                    }
                />

                <label>Taux horaire</label>

                <input
                    type="number"
                    value={userinfo.taux_horaire}
                    onChange={e =>
                        setUserinfo({
                            ...userinfo,
                            taux_horaire: e.target.value
                        })
                    }
                />

                <label>Lieu</label>

                <input
                    type="text"
                    value={userinfo.lieu}
                    onChange={e =>
                        setUserinfo({
                            ...userinfo,
                            lieu: e.target.value
                        })
                    }
                />

                {
                    userRoleConnected === "admin" &&
                    (
                        <select
                            value={userinfo.user_status}
                            onChange={e =>
                                setUserinfo({
                                    ...userinfo,
                                    user_status: e.target.value
                                })
                            }
                        >
                            <option value="validated">
                                Approuver
                            </option>

                            <option value="pending">
                                En attente
                            </option>
                        </select>
                    )
                }

                <button onClick={handleClickSave}>
                    Enregistrer
                </button>

                {
                    alert.alertAll &&
                    <div>{alert.alertAll}</div>
                }

            </div>

        </div>
    );
}