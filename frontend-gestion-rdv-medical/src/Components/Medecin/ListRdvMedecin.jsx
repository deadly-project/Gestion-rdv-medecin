import axios from "axios";

export default function ListRdvMedecin({ rdvs, setRdvs }){
    const urlRdv ="http://localhost:8080/backend/api/rendezvous";
    const token = sessionStorage.getItem("token");

    const validateRdv = async (id) =>{
        const res = await axios.put(
            `${urlRdv}?action=validate&id=${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
            setRdvs(prevRdvs => 
                prevRdvs.map(rdv => rdv.id === id ? { ...rdv, statut: "validated" } : rdv)
            );
        }
    }

    const refuseRdv = async (id) =>{
        const res = await axios.put(
            `${urlRdv}?action=refuse&id=${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
            setRdvs(prevRdvs => 
                prevRdvs.map(rdv => rdv.id === id ? { ...rdv, statut: "refused" } : rdv)
            );
        }
    }

    // Fonction utilitaire pour traduire et styliser les badges de statut
    const getStatusDetails = (status) => {
        switch(status) {
            case "pending": return { text: "En attente", class: "status-pending" };
            case "validated": return { text: "Validé", class: "status-validated" };
            case "refused": return { text: "Refusé", class: "status-refused" };
            case "cancelled": return { text: "Annulé", class: "status-cancelled" };
            default: return { text: status, class: "" };
        }
    };

    if (rdvs.length === 0) {
        return <div className="no-data">Aucun rendez-vous ne correspond à ces critères.</div>;
    }

    return(
        <div className="rdv-grid">
            {rdvs.map((rdv) => {
                const statusInfo = getStatusDetails(rdv.statut);
                return (
                    <div className="rdv-card" key={rdv.id}>
                        <div className="rdv-card-header">
                            <div className="rdv-time-box">
                                <span className="rdv-date">{rdv.date_rdv}</span>
                                <span className="rdv-hours">{rdv.heure_debut} - {rdv.heure_fin}</span>
                            </div>
                            <span className={`status-badge ${statusInfo.class}`}>
                                {statusInfo.text}
                            </span>
                        </div>

                        <div className="rdv-card-body">
                            <div className="patient-info">
                                <span className="patient-name">{rdv.nom_patient}</span>
                                <span className="patient-birth">Né(e) le {rdv.date_naissance}</span>
                            </div>
                            <div className="rdv-motif">
                                <strong>Motif :</strong> {rdv.motif}
                            </div>
                        </div>

                        {rdv.statut === "pending" && (
                            <div className="rdv-card-actions">
                                <button className="btn-action btn-validate" onClick={() => validateRdv(rdv.id)}>
                                    Valider
                                </button>
                                <button className="btn-action btn-refuse" onClick={() => refuseRdv(rdv.id)}>
                                    Refuser
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}