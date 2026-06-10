import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { BsFillPersonCheckFill } from "react-icons/bs";
import Profile from "../Common/Profil"; // Ton composant indépendant
import "../../css/Nav.css"

export default function NavAdmin({ userId, profile }) {
    const navigate = useNavigate();
    const role = sessionStorage.getItem("role")
    
    const logout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link to={`/dashboard/${role}/${userId}`}><IoHomeOutline /> Dashboard </Link>
                <Link to={`/ListMedecins/${role}/${userId}`}><BsFillPersonCheckFill /> Gérer Médecins</Link>
                <Link to={`/ListPatients/${role}/${userId}`}><BsFillPersonCheckFill /> Gérer Patients</Link>
            </div>

            {/* Ton composant indépendant reçoit les infos et se place à droite */}
            <Profile info={profile} />

            <FiLogOut onClick={logout} className="logout-icon" style={{ cursor: "pointer" }} />
        </nav>
    );
}