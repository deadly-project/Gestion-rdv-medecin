import "../../css/Profil.css";

export default function Profile({ info }){
    if (!info) return null; // Sécurité en attendant que l'API réponde

    return(
        <div className="nav-profile-badge">
            <div className="nav-avatar">
                {info.username ? info.username.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="nav-profile-info">
                <span className="nav-username">{info.username}</span>
                <span className="nav-role">{info.role}</span>
            </div>
        </div>
    )
}