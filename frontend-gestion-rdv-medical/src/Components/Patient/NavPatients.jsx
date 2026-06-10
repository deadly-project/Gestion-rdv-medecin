import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { BsFillGearFill } from "react-icons/bs";
import { BsFillCalendarPlusFill } from "react-icons/bs";
import Profile from "../Common/Profil"; // Importation de ton composant indépendant
import "../../css/Nav.css"; // Réutilisation du même fichier CSS unique

export default function NavPatients({ userId, profile }) {
    const navigate = useNavigate();
    const role = sessionStorage.getItem("role");
    
    const logout = () => {
        sessionStorage.clear(); // Corrigé pour s'aligner avec sessionStorage de l'admin et du médecin
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link to={`/dashboard/${role}/${userId}`}><IoHomeOutline /> Dashboard</Link>
                <Link to={`/UpdatePatient/${role}/${userId}`}><BsFillGearFill /> Modification du profil</Link>
                <Link to={`/ListRdv/${role}/${userId}`}><BsFillCalendarPlusFill /> Gérer Rdv</Link>
            </div>

            {/* Ton composant indépendant Profile s'intègre ici à droite */}
            <Profile info={profile} />

            <FiLogOut onClick={logout} className="logout-icon" style={{ cursor: "pointer" }} />
        </nav>
    );
}