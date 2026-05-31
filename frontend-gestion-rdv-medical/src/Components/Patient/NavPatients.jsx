import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";

export default function NavPatients({ userId }) {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <Link to={`/dashboard/${role}/${userId}`}><IoHomeOutline /> Dashboard  </Link>
            <Link to={`/UpdatePatient/${role}/${userId}`}><IoIosPersonAdd /> Modification du profils  </Link>
            <Link to={`/ListRdv/${role}/${userId}`}><IoIosPersonAdd /> Gérer Rdv</Link>
            <FiLogOut onClick={logout} style={{ cursor: "pointer" }} />
        </nav>
    );
}