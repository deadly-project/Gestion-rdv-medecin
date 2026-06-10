import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css" // Importation du nouveau fichier CSS

export default function Login() {
    const navigate = useNavigate();
    const [login, setLogin] = useState({
        username: "",
        password: ""
    });
    const [alert, setAlert] = useState("");
    const url = "http://localhost:8080/backend/login";

    const handleClickLogin = async () => {
        try {
            const res = await axios.post(url, login);
            if (res.data.success) {
                const id = res.data.id;
                const role = res.data.role;
                sessionStorage.setItem("token", res.data.token);
                sessionStorage.setItem("id", id);
                sessionStorage.setItem("role", role);
                navigate(`/dashboard/${role}/${id}`);
            } else {
                setAlert(res.data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">Connexion</h1>
                
                <div className="form-group">
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input 
                        id="username"
                        type="text" 
                        placeholder="Ex: Rakoto"
                        onChange={e => setLogin({ ...login, username: e.target.value })} 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                        id="password"
                        type="password" 
                        placeholder="••••••••"
                        onChange={e => setLogin({ ...login, password: e.target.value })} 
                    />
                </div>

                <button className="login-btn" onClick={handleClickLogin}>
                    Se connecter
                </button>

                <div className="login-footer">
                    <span>Pas encore de compte ?</span>{" "}
                    <Link to="/register" className="register-link">S'inscrire</Link>
                </div>

                {alert && <div className="login-alert">{alert}</div>}
            </div>
        </div>
    );
}