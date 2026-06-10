import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Register.css";

export default function Register() {
  const navigate = useNavigate();
  
  const [userinfo, setUserinfo] = useState({
    nom: "",
    prenom: "",
    username: "",
    email: "",
    role: "client",
    password: ""
  });

  const [dateNais, setDateNais] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [tauxHoraire, setTauxHoraire] = useState("");
  const [lieu, setLieu] = useState("");

  const [alert, setAlert] = useState({
    resultatUsername: false,
    resultatPassword: false,
    resultatEmail: false,
    alertUsername: "",
    alertPassword: "",
    alerrtEmail: "",
    alertAll: ""
  });
  
  // États pour contrôler la modale de succès
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  const [confirmation, setConfirmation] = useState('');
  const [typemdp, setType] = useState('password');
  const [typeconfirmation, setTypeConfirmation] = useState('password');
  const url = 'http://localhost:8080/backend/';

  useEffect(() => {
      if(!userinfo.username) return;

      if(userinfo.username.length <= 2 ){
          setAlert(prev=>({...prev, alertUsername:"L'username doit faire plus de 2 caractères !"}))
      }else{
          setAlert(prev => ({...prev, alertUsername:"Vérification ..."}))
          const verificationUsername = setTimeout(async () => 
              {
                  try{
                          const res = await axios.get(`${url}/register/${userinfo.username}`);
                          setAlert(prev => ({...prev, resultatUsername:res.data.available, alertUsername:res.data.message}))
                  }catch(error){
                      console.log(error);
                  }
              }, 1000)
              return ()=> clearTimeout(verificationUsername);
      }
  }, [userinfo.username]);

  const handleClickSee = (valeur, set) => {
    (valeur === "password") ? set("text") : set("password");
  };

  const handleClickSave = async () => {
    setAlert({ ...alert, alertAll: "" });

    if (!userinfo.username || !userinfo.password || !userinfo.nom || !userinfo.prenom || !userinfo.email) {
      setAlert({ ...alert, alertAll: "Veuillez remplir tout le formulaire de base !" });
      return;
    }

    if (userinfo.password !== confirmation) {
      setAlert({ ...alert, alertAll: "Les mots de passe ne correspondent pas !" });
      return;
    }

    if (!alert.resultatUsername && alert.alertUsername !== "Vérification ...") {
      setAlert({ ...alert, alertAll: "Veuillez choisir un nom d'utilisateur disponible !" });
      return;
    }

    let donneesFinales = { ...userinfo };

    if (userinfo.role === "client") {
      if (!dateNais) {
        setAlert({ ...alert, alertAll: "Veuillez entrer votre date de naissance !" });
        return;
      }
      donneesFinales.details = { datenais: dateNais };
    } else if (userinfo.role === "medecin") {
      if (!specialite || !tauxHoraire || !lieu) {
        setAlert({ ...alert, alertAll: "Veuillez remplir toutes les informations médicales !" });
        return;
      }
      donneesFinales.details = {
        specialité: specialite,
        taux_horaire: tauxHoraire,
        lieu: lieu
      };
    }

    try {
      const response = await axios.post(`${url}/register`, donneesFinales);
      console.log(response.data);
      
      // On configure et on affiche la modale au lieu d'une simple alerte
      setModalText("Félicitations, votre compte a été créé avec succès !");
      setShowModal(true);

    } catch (error) {
      console.log(error);
      setAlert({ ...alert, alertAll: "Erreur lors de l'enregistrement." });
    }
  };

  // Fonction déclenchée au clic sur le bouton OK de la modale
  const handleModalClose = () => {
    setShowModal(false);
    navigate("/"); // Redirection vers la page login
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <Link to="/" className="back-link">← Retour</Link>
        <h2 className="register-title">Création de compte</h2>

        <div className="register-grid">
          <div className="form-group">
            <label htmlFor="nom">Nom</label>
            <input type="text" id="nom" onChange={e => setUserinfo({ ...userinfo, nom: e.target.value })} />
          </div>

          <div className="form-group">
            <label htmlFor="Prenom">Prénom</label>
            <input type="text" id="Prenom" onChange={e => setUserinfo({ ...userinfo, prenom: e.target.value })} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="Username">Nom d'utilisateur</label>
          <input type="text" id="Username" onChange={e => setUserinfo({ ...userinfo, username: e.target.value })} />
          {alert.alertUsername && (
            <div className={`username-status ${alert.resultatUsername ? 'status-available' : 'status-taken'}`}>
              {alert.alertUsername}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="Email">Email</label>
          <input type="email" id="Email" onChange={e => setUserinfo({ ...userinfo, email: e.target.value })} />
        </div>

        <div className="form-group">
          <label htmlFor="Role">Type de compte</label>
          <select
            name="role-select"
            id="Role"
            value={userinfo.role}
            onChange={e => setUserinfo({ ...userinfo, role: e.target.value })}
            className="role-select"
          >
            <option value="client">Client (Patient)</option>
            <option value="medecin">Médecin</option>
          </select>
        </div>

        {/* --- ZONE DYNAMIQUE --- */}
        <div className="dynamic-section">
          {userinfo.role === "client" ? (
            <div className="dynamic-box">
              <h3>Informations Patient</h3>
              <div className="form-group">
                <label htmlFor="datenais">Date de naissance</label>
                <input type="date" id="datenais" value={dateNais} onChange={e => setDateNais(e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="dynamic-box">
              <h3>Informations Médecin</h3>
              <div className="form-group">
                <label htmlFor="specialite">Spécialité</label>
                <input type="text" id="specialite" value={specialite} placeholder="Ex: Cardiologue" onChange={e => setSpecialite(e.target.value)} />
              </div>

              <div className="register-grid">
                <div className="form-group">
                  <label htmlFor="taux">Taux horaire (Ar/h)</label>
                  <input type="number" id="taux" value={tauxHoraire} onChange={e => setTauxHoraire(parseInt(e.target.value))} />
                </div>

                <div className="form-group">
                  <label htmlFor="lieu">Lieu du cabinet</label>
                  <input type="text" id="lieu" value={lieu} placeholder="Ex: Analakely" onChange={e => setLieu(e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* --- FIN DE LA ZONE DYNAMIQUE --- */}

        <div className="form-group password-group">
          <label htmlFor="mdp">Mot de passe</label>
          <div className="password-wrapper">
            <input type={typemdp} id="mdp" onChange={e => setUserinfo({ ...userinfo, password: e.target.value })} />
            <button type="button" className="toggle-password" onClick={() => { handleClickSee(typemdp, setType) }}>
              {typemdp === "password" ? "Voir" : "Masquer"}
            </button>
          </div>
        </div>

        <div className="form-group password-group">
          <label htmlFor="confirmation_mdp">Confirmer le mot de passe</label>
          <div className="password-wrapper">
            <input type={typeconfirmation} id="confirmation_mdp" onChange={(e) => { setConfirmation(e.target.value) }} />
            <button type="button" className="toggle-password" onClick={() => { handleClickSee(typeconfirmation, setTypeConfirmation) }}>
              {typeconfirmation === "password" ? "Voir" : "Masquer"}
            </button>
          </div>
        </div>

        <button className="register-btn" onClick={handleClickSave}>Enregistrer</button>
        
        {alert.alertAll && <div className="register-alert-error">{alert.alertAll}</div>}
      </div>

      {/* --- LA MODALE UX PREMIUM --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">✓</div>
            <h3 className="modal-title">Compte créé !</h3>
            <p className="modal-text">{modalText}</p>
            <button className="modal-btn" onClick={handleModalClose}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}