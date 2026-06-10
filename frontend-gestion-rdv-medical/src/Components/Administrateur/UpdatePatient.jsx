import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavAdmin from "./NavAdmin";
import NavPatients from "../Patient/NavPatients";
import "../../css/UpdateMedecin.css"; // Réutilisation du même design premium pour les formulaires

export default function UpdatePatient() {
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
        nom_pat: "",
        username: "",
        email: "",
        datenais: "",
        user_status: "pending"
    });

    const [alert, setAlert] = useState({
        alertUsername: "",
        resultatUsername: false,
        alertAll: ""
    });

    // État pour afficher la modale de succès
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const urlUpdate = "http://localhost:8080/backend/api/admin/patients";
    const urlGet = "http://localhost:8080/backend/api/admin/patients";
    const urlVerification = "http://localhost:8080/backend/register";

    // LOAD DATA
    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await axios.get(`${urlGet}?id=${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const usernameCharge = res.data.username || "";
                originalUsername.current = usernameCharge;

                setUserinfo({
                    id: res.data.id,
                    nom_pat: res.data.nom_pat || "",
                    username: res.data.username || "",
                    email: res.data.email || "",
                    datenais: res.data.datenais || "",
                    user_status: res.data.user_status || "pending"
                });
            } catch(err) {
                console.log(err);
            }
        };
        fetchPatient();
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
        
        if (usernameModified.current && !alert.resultatUsername && alert.alertUsername !== "Vérification ...") {
            setAlert(prev => ({ ...prev, alertAll: "Veuillez corriger le nom d'utilisateur d'abord." }));
            return;
        }

        try {
            await axios.put(urlUpdate, userinfo, {
                headers: { Authorization: `Bearer ${token}` }
            });

            originalUsername.current = userinfo.username;
            usernameModified.current = false;
            
            // Déclenche l'affichage de la modale
            setShowSuccessModal(true);
        } catch (error) {
            console.log(error);
            setAlert(prev => ({ ...prev, alertAll: "Erreur lors de la modification." }));
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        if(role == "admin"){
            navigate(`/ListPatients/${role}/${id}`);
        }else{
            navigate(`/dashboard/${role}/${id}`);
        }
    };

    return (
        <div className="update-page-container">
            {role === "admin" ? (
                <NavAdmin userId={idUserConnected} profile={profile}/>
            ) : (
                <NavPatients userId={id} profile={profile}/>
            )}

            <div className="update-card-box">
                <div className="update-card-header">
                    <h2>Mise à jour du compte Patient</h2>
                    <p>Modifiez et mettez à jour les informations du dossier patient.</p>
                </div>

                <div className="update-form-grid">
                    {/* Nom Complet */}
                    <div className="form-item">
                        <label>Nom complet</label>
                        <input
                            type="text"
                            value={userinfo.nom_pat}
                            onChange={e => setUserinfo({ ...userinfo, nom_pat: e.target.value })}
                            placeholder="Ex: Madame Safidy Alida"
                        />
                    </div>

                    {/* Username */}
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

                    {/* Adresse Email */}
                    <div className="form-item">
                        <label>Adresse email</label>
                        <input
                            type="email"
                            value={userinfo.email}
                            onChange={e => setUserinfo({ ...userinfo, email: e.target.value })}
                            placeholder="patient@exemple.com"
                        />
                    </div>

                    {/* Date de Naissance */}
                    <div className="form-item">
                        <label>Date de Naissance</label>
                        <input
                            type="date"
                            value={userinfo.datenais}
                            onChange={e => setUserinfo({ ...userinfo, datenais: e.target.value })}
                        />
                    </div>
                </div>

                {/* Statut exclusif Admin */}
                {userRoleConnected === "admin" && (
                    <div className="admin-status-section">
                        <label>Statut d'accès du patient</label>
                        <select
                            value={userinfo.user_status}
                            onChange={e => setUserinfo({ ...userinfo, user_status: e.target.value })}
                            className="status-select-input"
                        >
                            <option value="validated">✓ Activer / Approuver</option>
                            <option value="pending">⏳ Mettre En attente</option>
                        </select>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="form-footer-actions">
                    <button className="save-profile-btn" onClick={handleClickSave}>
                        Enregistrer les informations
                    </button>
                    {alert.alertAll && <div className="form-error-alert">{alert.alertAll}</div>}
                </div>
            </div>

            {/* --- MODALE DE CONFIRMATION PREMIUM --- */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-icon">✓</div>
                        <h3 className="modal-title">Modifications enregistrées !</h3>
                        <p className="modal-text">Les détails du compte patient ont été mis à jour avec succès.</p>
                        <button className="modal-btn" onClick={handleModalClose}>Continuer</button>
                    </div>
                </div>
            )}
        </div>
    );
}