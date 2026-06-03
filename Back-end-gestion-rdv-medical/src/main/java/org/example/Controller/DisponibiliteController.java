package org.example.Controller;

import org.example.DAO.DisponibiliteDAO;
import org.example.Models.DisponibiliteModel;

import java.util.List;

public class DisponibiliteController {

    private final DisponibiliteDAO dao =
            new DisponibiliteDAO();

    public boolean createDisponibilite(
            DisponibiliteModel dispo
    ){
        return dao.createDisponibilite(dispo);
    }

    public List<DisponibiliteModel>
    getDisponibilitesByMedecin(
            int idMedecin
    ){
        return dao.getDisponibilitesByMedecin(idMedecin);
    }

    public boolean updateDisponibilite(
            DisponibiliteModel dispo
    ){
        return dao.updateDisponibilite(dispo);
    }

    public boolean deleteDisponibilite(
            int id
    ){
        return dao.deleteDisponibilite(id);
    }
}