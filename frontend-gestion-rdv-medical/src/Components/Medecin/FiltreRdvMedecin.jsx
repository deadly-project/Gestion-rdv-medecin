import { useMemo, useState } from "react";
import ListRdvMedecin from "./ListRdvMedecin";

export default function FiltreRdvMedecin({ rdvs, setRdvs }) {
    const [statutFilter, setStatutFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");

    const filteredRdvs = useMemo(() => {
        return rdvs.filter((rdv) => {
            const matchStatut = statutFilter === "all" || rdv.statut === statutFilter;
            const matchDate = dateFilter === "" || rdv.date_rdv === dateFilter;
            return matchStatut && matchDate;
        });
    }, [rdvs, statutFilter, dateFilter]);

    return (
        <div className="appointments-section">
            <div className="section-header">
                <h2>Gestion des rendez-vous</h2>
                <span className="appointments-count">
                    {filteredRdvs.length} {filteredRdvs.length > 1 ? "rendez-vous" : "rendez-vous"}
                </span>
            </div>

            {/* Barre de filtres moderne */}
            <div className="filters-bar">
                <div className="filter-group-item">
                    <label>Statut</label>
                    <select
                        value={statutFilter}
                        onChange={(e) => setStatutFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Tous</option>
                        <option value="pending">En attente</option>
                        <option value="validated">Validés</option>
                        <option value="refused">Refusés</option>
                        <option value="cancelled">Annulés</option>
                    </select>
                </div>

                <div className="filter-group-item">
                    <label>Date</label>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="filter-date"
                    />
                </div>

                <button
                    className="btn-reset"
                    onClick={() => {
                        setStatutFilter("all");
                        setDateFilter("");
                    }}
                >
                    Réinitialiser
                </button>
            </div>

            <ListRdvMedecin rdvs={filteredRdvs} setRdvs={setRdvs} />
        </div>
    );
}