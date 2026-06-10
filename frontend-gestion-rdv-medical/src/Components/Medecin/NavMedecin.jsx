import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { BsFillGearFill } from "react-icons/bs";
import { BsCalendar4Week } from "react-icons/bs";
import Profile from "../Common/Profil"; // Importation de ton composant indépendant
import "../../css/Nav.css"; // Réutilisation du même fichier CSS

export default function NavMedecin({ userId, profile }) {
    const navigate = useNavigate();
    const role = sessionStorage.getItem("role");
    
    const logout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link to={`/dashboard/${role}/${userId}`}><IoHomeOutline /> Dashboard</Link>
                <Link to={`/UpdateMedecin/${role}/${userId}`}><BsFillGearFill /> Modification du profil</Link>
                <Link to={`/ListDisponibility/${role}/${userId}`}><BsCalendar4Week /> Mes disponibilités</Link>
            </div>

            {/* Ton composant indépendant se place à droite automatiquement grâce au CSS */}
            <Profile info={profile} />

            <FiLogOut onClick={logout} className="logout-icon" style={{ cursor: "pointer" }} />
        </nav>
    );
}