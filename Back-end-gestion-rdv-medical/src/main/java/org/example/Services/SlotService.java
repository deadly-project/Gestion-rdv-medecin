package org.example.Services;

import org.example.DAO.DisponibiliteDAO;
import org.example.DAO.RendezVousDAO;
import org.example.Models.DisponibiliteModel;
import org.example.Models.RendezVousModel;
import org.example.Models.SlotModel;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class SlotService {

    private final DisponibiliteDAO dispoDAO =
            new DisponibiliteDAO();

    private final RendezVousDAO rdvDAO =
            new RendezVousDAO();

    // =========================
    // GENERER LES CRENEAUX DE 30 MIN
    // =========================
    public List<SlotModel> generateSlots(
            int idDisponibilite,
            String start,
            String end
    ) {

        List<SlotModel> slots =
                new ArrayList<>();

        LocalTime s =
                LocalTime.parse(start);

        LocalTime e =
                LocalTime.parse(end);

        while (!s.plusMinutes(30).isAfter(e)) {

            LocalTime next =
                    s.plusMinutes(30);

            slots.add(
                    new SlotModel(
                            idDisponibilite,
                            s.toString(),
                            next.toString()
                    )
            );

            s = next;
        }

        return slots;
    }

    // =========================
    // SLOTS DISPONIBLES
    // =========================
    public List<SlotModel> getSlots(
            int idMedecin,
            String date
    ) {

        List<DisponibiliteModel> dispos =
                dispoDAO.getDisponibilitesByMedecinAndDate(
                        idMedecin,
                        date
                );

        List<RendezVousModel> rdvs =
                rdvDAO.getRdvByMedecinAndDate(
                        idMedecin,
                        date
                );

        List<SlotModel> allSlots =
                new ArrayList<>();

        // Génération des créneaux
        for (DisponibiliteModel d : dispos) {

            allSlots.addAll(
                    generateSlots(
                            d.getId(),
                            d.getHeure_debut()
                                    .substring(0, 5),
                            d.getHeure_fin()
                                    .substring(0, 5)
                    )
            );
        }

        // Suppression des créneaux déjà réservés
        List<SlotModel> result =
                new ArrayList<>();

        for (SlotModel slot : allSlots) {

            boolean taken = false;

            for (RendezVousModel r : rdvs) {

                String rdvDebut =
                        r.getHeure_debut()
                                .substring(0, 5);

                String rdvFin =
                        r.getHeure_fin()
                                .substring(0, 5);

                if (
                        slot.getHeure_debut()
                                .equals(rdvDebut)
                                &&
                                slot.getHeure_fin()
                                        .equals(rdvFin)
                ) {

                    taken = true;
                    break;
                }
            }

            if (!taken) {
                result.add(slot);
            }
        }

        return result;
    }
}