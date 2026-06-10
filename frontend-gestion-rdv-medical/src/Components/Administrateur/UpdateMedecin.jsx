import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavAdmin from "./NavAdmin";
import NavMedecin from "../Medecin/NavMedecin";
import "../../css/UpdateMedecin.css"; // Nouveau fichier CSS bento/SaaS

export default function UpdateMedecin() {
    const { role, id } = useParams();
    const navigate = useNavigate();
    const idUserConnected = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");
    const userRoleConnected = sessionStorage.getItem("role");

    const usernameModified = useRef(false);
    const originalUsername = useRef("");

    const profileRaw = sessionStorage.getItem("profile");
    const profile = profileRaw ? JSON.parse(profileRaw) : null;

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

    // État pour gérer l'affichage de la modale de succès
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const urlUpdate = "http://localhost:8080/backend/api/admin/medecins";
    const urlGet = "http://localhost:8080/backend/api/admin/medecins";
    const urlVerification = "http://localhost:8080/backend/register";

    // LOAD DATA
    useEffect(() => {
        const fetchMedecin = async () => {
            try {
                const res = await axios.get(`${urlGet}?id=${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const usernameCharge = res.data.username || "";
                originalUsername.current = usernameCharge;

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
        if (!usernameModified.current || !userinfo.username) return;

        if (userinfo.username.length <= 2) {
            setAlert(prev => ({
                ...prev,
                alertUsername: "L'username doit faire plus de 2 caractères !",
                resultatUsername: false
            }));
            return;
        }

        if (userinfo.username === originalUsername.current) {
            setAlert(prev => ({ ...prev, alertUsername: "", resultatUsername: true }));
            return;
        }

        setAlert(prev => ({ ...prev, alertUsername: "Vérification ..." }));

        const verificationUsername = setTimeout(async () => {
            try {
                const res = await axios.get(`${urlVerification}/${userinfo.username}`);
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
        setAlert(prev => ({ ...prev, alertAll: "" }));
        
        // Bloquer si l'username tapé est indisponible
        if (usernameModified.current && !alert.resultatUsername && alert.alertUsername !== "Vérification ...") {
            setAlert(prev => ({ ...prev, alertAll: "Veuillez corriger le nom d'utilisateur d'abord." }));
            return;
        }

        try {
            const response = await axios.put(urlUpdate, userinfo, {
                headers: { Authorization: `Bearer ${token}` }
            });

            originalUsername.current = userinfo.username;
            usernameModified.current = false;
            
            // Ouvrir la modale au lieu d'afficher un simple texte
            setShowSuccessModal(true);
        } catch (error) {
            console.log(error);
            setAlert(prev => ({ ...prev, alertAll: "Erreur lors de la modification." }));
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        if(role === "admin"){
            navigate(`/ListMedecins/${role}/${id}`);
        }else{
            navigate(`/dashboard/${role}/${id}`);
        }

    };

    return (
        <div className="update-page-container">
            {role === "admin" ? (
                <NavAdmin userId={idUserConnected} profile={profile}/>
            ) : (
                <NavMedecin userId={id} profile={profile}/>
            )}

            <div className="update-card-box">
                <div className="update-card-header">
                    <h2>Mise à jour du compte</h2>
                    <p>Modifiez les informations du profil médical ci-dessous.</p>
                </div>

                <div className="update-form-grid">
                    {/* Colonne 1 */}
                    <div className="form-item">
                        <label>Nom complet</label>
                        <input
                            type="text"
                            value={userinfo.nom_med}
                            onChange={e => setUserinfo({ ...userinfo, nom_med: e.target.value })}
                            placeholder="Ex: Dr. Jean Dupont"
                        />
                    </div>

                    <div className="form-item">
                        <label>Nom d'utilisateur (Username)</label>
                        <input
                            type="text"
                            value={userinfo.username}
                            onChange={e => {
                                usernameModified.current = true;
                                setUserinfo({ ...userinfo, username: e.target.value });
                            }}
                        />
                        {alert.alertUsername && (
                            <div className={`username-feedback ${alert.resultatUsername ? 'avail' : 'taken'}`}>
                                {alert.alertUsername}
                            </div>
                        )}
                    </div>

                    {/* Colonne 2 */}
                    <div className="form-item">
                        <label>Adresse email</label>
                        <input
                            type="email"
                            value={userinfo.email}
                            onChange={e => setUserinfo({ ...userinfo, email: e.target.value })}
                        />
                    </div>

                    <div className="form-item">
                        <label>Spécialité</label>
                        <input
                            type="text"
                            value={userinfo.specialite}
                            onChange={e => setUserinfo({ ...userinfo, specialite: e.target.value })}
                        />
                    </div>

                    {/* Colonne 3 */}
                    <div className="form-item">
                        <label>Taux horaire (Ar/h)</label>
                        <input
                            type="number"
                            value={userinfo.taux_horaire}
                            onChange={e => setUserinfo({ ...userinfo, taux_horaire: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="form-item">
                        <label>Lieu du cabinet</label>
                        <input
                            type="text"
                            value={userinfo.lieu}
                            onChange={e => setUserinfo({ ...userinfo, lieu: e.target.value })}
                        />
                    </div>
                </div>

                {/* Section d'administration pour le statut */}
                {userRoleConnected === "admin" && (
                    <div className="admin-status-section">
                        <label>Statut de validation du compte</label>
                        <select
                            value={userinfo.user_status}
                            onChange={e => setUserinfo({ ...userinfo, user_status: e.target.value })}
                            className="status-select-input"
                        >
                            <option value="validated">✓ Approuver le compte</option>
                            <option value="pending">⏳ En attente de validation</option>
                        </select>
                    </div>
                )}

                {/* Bouton Enregistrer et Alerte d'erreur */}
                <div className="form-footer-actions">
                    <button className="save-profile-btn" onClick={handleClickSave}>
                        Enregistrer les modifications
                    </button>
                    {alert.alertAll && <div className="form-error-alert">{alert.alertAll}</div>}
                </div>
            </div>

            {/* --- MODALE DE SUCCÈS --- */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-icon">✓</div>
                        <h3 className="modal-title">Profil mis à jour !</h3>
                        <p className="modal-text">Les modifications ont été enregistrées avec succès dans la base de données.</p>
                        <button className="modal-btn" onClick={handleModalClose}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}