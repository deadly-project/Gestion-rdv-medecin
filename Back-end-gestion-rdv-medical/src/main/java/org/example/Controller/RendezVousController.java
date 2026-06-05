package org.example.Controller;

import org.example.DAO.RendezVousDAO;
import org.example.Models.RendezVousModel;

import java.util.List;

public class RendezVousController {

    private final RendezVousDAO dao = new RendezVousDAO();

    public boolean create(RendezVousModel rdv) {
        return dao.createRendezVous(rdv);
    }

    public List<RendezVousModel> getByPatient(int id) {
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

    public List<RendezVousModel> getByMedecin(
            int id
    ) {
        return dao.getMedecinRdv(id);
    }
}