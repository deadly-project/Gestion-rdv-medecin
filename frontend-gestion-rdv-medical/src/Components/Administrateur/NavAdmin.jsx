import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";

export default function NavAdmin({ userId }) {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <Link to={`/dashboard/admin/${userId}`}><IoHomeOutline /> Dashboard</Link>
            {" | "}
            <Link to={`/ListMedecins/admin/${userId}`}><IoIosPersonAdd /> Gérer Médecins</Link>
            {" | "}
            <Link to={`/ListPatients/admin/${userId}`}><IoIosPersonAdd /> Gérer Patients</Link>
            {" | "}
            <FiLogOut onClick={logout} style={{ cursor: "pointer" }} />
        </nav>
    );
}