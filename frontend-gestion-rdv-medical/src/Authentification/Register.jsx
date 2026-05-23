import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // N'oublie pas d'importer axios s'il ne l'était pas

export default function Register() {
  const [userinfo, setUserinfo] = useState({
    nom: "",
    prenom: "",
    username: "",
    email: "",
    role: "client", // Initialisé à 'client' pour correspondre à la première option du select
    password: ""
  });

  // Nouveaux états pour les informations spécifiques
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
  
  const [confirmation, setConfirmation] = useState('');
  const [userExist, setuserExist] = useState(false);
  const [typemdp, setType] = useState('password');
  const [typeconfirmation, setTypeConfirmation] = useState('password');
  const [Res, SetRes] = useState({});
  const url = 'http://localhost:8080/backend/';

  // Code de vérification d'username (laissé tel quel)
  // useEffect(() => {
  //     if(!userinfo.username) return;

  //     if(userinfo.username.length <= 2 ){
  //         setAlert(prev=>({...prev, alertUsername:"L'username doit être plus de 2 caractère !"}))
  //     }else{
  //         setAlert(prev => ({...prev, alertUsername:"Verification ..."}))
  //         const verificationUsername = setTimeout(async () => 
  //             {
  //                 try{
  //                         const res = await axios.post(`${url}/verify`, {username:userinfo.username});
  //                         console.log(res.data.available)
  //                         setAlert(prev => ({...prev, resultatUsername:res.data.available, alertUsername:res.data.message}))
  //                 }catch(error){
  //                     console.log(error);
  //                 }
  //             }, 1000)
  //             return ()=> clearTimeout(verificationUsername);
  //     }
  // }, [userinfo.username]);

  const handleClickSee = (valeur, set) => {
    (valeur === "password") ? set("text") : set("password");
  };

  const handleClickSave = async () => {
    console.log(userinfo);
    
    // Validation de base des champs communs
    if (!userinfo.username || !userinfo.password || !userinfo.nom || !userinfo.prenom || !userinfo.email) {
      setAlert({ ...alert, alertAll: "Veuillez remplir tout le formulaire de base !" });
      return;
    }

    // Validation des mots de passe
    if (userinfo.password !== confirmation) {
      setAlert({ ...alert, alertAll: "Les mots de passe ne correspondent pas !" });
      return;
    }

    // Préparation de l'objet final selon le rôle
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
      // Envoi de l'objet structuré au backend
      const response = await axios.post(`${url}/register`, donneesFinales);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setAlert({ ...alert, alertAll: "Erreur lors de l'enregistrement." });
    }
  };

  const dispoUsername = (e) => {
    if (e) {
      return "green";
    } else {
      return "red";
    }
  };

  return (
    <div>
      <Link to="/">Retour</Link>
      <div className="formulaire-register">
        <h2>Creation de compte</h2>

        <label htmlFor="nom">Nom</label>
        <input type="text" id="nom" onChange={e => setUserinfo({ ...userinfo, nom: e.target.value })} />

        <label htmlFor="Prenom">Prenom</label>
        <input type="text" id="Prenom" onChange={e => setUserinfo({ ...userinfo, prenom: e.target.value })} />

        <label htmlFor="Username">Nom d'utilisateur</label>
        <input type="text" id="Username" onChange={e => setUserinfo({ ...userinfo, username: e.target.value })} />
        {alert.alertUsername && (<div style={{ color: dispoUsername(alert.resultatUsername) }}>{alert.alertUsername}</div>)}

        <label htmlFor="Email">Email</label>
        <input type="text" id="Email" onChange={e => setUserinfo({ ...userinfo, email: e.target.value })} />

        <label htmlFor="Role">Type de compte</label>
        <select
          name="role-select"
          id="Role"
          value={userinfo.role}
          onChange={e => setUserinfo({ ...userinfo, role: e.target.value })}
        >
          <option value="client">Client</option>
          <option value="medecin">Medecin</option>
        </select>

        {/* --- ZONE DYNAMIQUE --- */}
        {userinfo.role === "client" ? (
          <div>
            <h3>Informations Patient</h3>
            <label htmlFor="datenais">Date de naissance</label>
            <input type="date" id="datenais" value={dateNais} onChange={e => setDateNais(e.target.value)} />
          </div>
        ) : (
          <div>
            <h3>Informations Médecin</h3>
            <label htmlFor="specialite">Spécialité</label>
            <input type="text" id="specialite" value={specialite} onChange={e => setSpecialite(e.target.value)} />

            <label htmlFor="taux">Taux horaire</label>
            <input type="number" id="taux" value={tauxHoraire} onChange={e => setTauxHoraire(parseInt(e.target.value))} />

            <label htmlFor="lieu">Lieu du cabinet</label>
            <input type="text" id="lieu" value={lieu} onChange={e => setLieu(e.target.value)} />
          </div>
        )}
        {/* --- FIN DE LA ZONE DYNAMIQUE --- */}

        <div>
          <label htmlFor="mdp">Mot de passe</label>
          <input type={typemdp} id="mdp" onChange={e => setUserinfo({ ...userinfo, password: e.target.value })} />
          <button onClick={() => { handleClickSee(typemdp, setType) }}>voir</button>
        </div>

        <div>
          <label htmlFor="confirmation_mdp">Confirmer votre mot de passe</label>
          <input type={typeconfirmation} id="confirmation_mdp" onChange={(e) => { setConfirmation(e.target.value) }} />
          <button onClick={() => { handleClickSee(typeconfirmation, setTypeConfirmation) }}>voir</button><br />
        </div>

        <button onClick={handleClickSave}>Enregistrer</button>
        {alert.alertAll && (<div>{alert.alertAll}</div>)}
      </div>
    </div>
  );
}