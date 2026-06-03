package org.example.Controller;

import org.example.DAO.RendezVousDAO;
import org.example.Models.RendezVousModel;

import java.util.List;

public class RendezVousController {

    private final RendezVousDAO dao =
            new RendezVousDAO();

    public boolean createRendezVous(
            RendezVousModel rdv
    ){
        return dao.createRendezVous(rdv);
    }

    public List<RendezVousModel>
    getPatientRdv(
            int patientId
    ){
        return dao.getPatientRdv(patientId);
    }

    public boolean validateRdv(
            int id
    ){
        return dao.validateRdv(id);
    }

    public boolean refuseRdv(
            int id
    ){
        return dao.refuseRdv(id);
    }
}