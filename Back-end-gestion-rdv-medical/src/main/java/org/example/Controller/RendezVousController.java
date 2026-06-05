package org.example.Controller;

import org.example.DAO.RendezVousDAO;
import org.example.DTO.RendezVousMedecinDTO;
import org.example.DTO.RendezVousPatientDTO;
import org.example.Models.RendezVousModel;
import org.example.DTO.RendezVousNotification;

import java.util.List;

public class RendezVousController {

    private final RendezVousDAO dao = new RendezVousDAO();

    public boolean create(RendezVousModel rdv) {
        return dao.createRendezVous(rdv);
    }

    public List<RendezVousPatientDTO> getByPatient(int id) {
        return dao.getPatientRdv(id);
    }

    public boolean validate(int id) {
        return dao.validateRdv(id);
    }

    public boolean refuse(int id) {
        return dao.refuseRdv(id);
    }

    public boolean cancel(int id) {
        return dao.cancelRdv(id);
    }

    public boolean update(
            RendezVousModel rdv
    ) {
        return dao.updateRendezVous(rdv);
    }

    public boolean slotExiste(
            int idMedecin,
            String date,
            String debut,
            String fin
    ) {
        return dao.slotExiste(
                idMedecin,
                date,
                debut,
                fin
        );
    }

    public List<RendezVousMedecinDTO> getByMedecin(
            int id
    ) {
        return dao.getMedecinRdv(id);
    }

    public RendezVousNotification getNotificationData(
            int rdvId
    ) {
        return dao.getNotificationData(rdvId);
    }
}