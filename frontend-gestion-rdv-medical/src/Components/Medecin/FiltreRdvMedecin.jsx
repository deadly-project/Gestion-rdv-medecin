import { useMemo, useState } from "react";
import ListRdvMedecin from "./ListRdvMedecin";

export default function FiltreRdvMedecin({
    rdvs,
    setRdvs
}) {

    const [statutFilter, setStatutFilter] =
        useState("all");

    const [dateFilter, setDateFilter] =
        useState("");

    const filteredRdvs =
        useMemo(() => {

            return rdvs.filter((rdv) => {

                const matchStatut =
                    statutFilter === "all" ||
                    rdv.statut === statutFilter;

                const matchDate =
                    dateFilter === "" ||
                    rdv.date_rdv === dateFilter;

                return (
                    matchStatut &&
                    matchDate
                );
            });

        }, [
            rdvs,
            statutFilter,
            dateFilter
        ]);

    return (

        <div>

            <h2>
                Gestion des rendez-vous
            </h2>

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "20px"
                }}
            >

                <select
                    value={statutFilter}
                    onChange={(e) =>
                        setStatutFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="all">
                        Tous
                    </option>

                    <option value="pending">
                        En attente
                    </option>

                    <option value="validated">
                        Validés
                    </option>

                    <option value="refused">
                        Refusés
                    </option>

                    <option value="cancelled">
                        Annulés
                    </option>

                </select>

                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) =>
                        setDateFilter(
                            e.target.value
                        )
                    }
                />

                <button
                    onClick={() => {

                        setStatutFilter("all");
                        setDateFilter("");
                    }}
                >
                    Réinitialiser
                </button>

            </div>

            <div
                style={{
                    marginBottom: "15px"
                }}
            >
                <strong>
                    Nombre :
                    {" "}
                    {filteredRdvs.length}
                </strong>
            </div>

            <ListRdvMedecin
                rdvs={filteredRdvs}
                setRdvs={setRdvs}
            />

        </div>
    );
}