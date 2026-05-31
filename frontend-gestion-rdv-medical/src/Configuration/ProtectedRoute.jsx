import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (!token) {
        return <Navigate to="/" />;
    }
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirige vers son propre dashboard en cas d'accès interdit
        const id = localStorage.getItem("id");
        return <Navigate to={`/dashboard/${userRole}/${id}`} />;
    }
    return children;

}

export default ProtectedRoute;