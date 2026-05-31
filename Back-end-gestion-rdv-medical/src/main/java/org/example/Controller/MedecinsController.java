package org.example.Controller;

import org.example.DAO.MedecinsDAO;
import org.example.Models.MedecinModels;

import java.util.List;

public class MedecinsController {

    private final MedecinsDAO dao =
            new MedecinsDAO();

    public List<MedecinModels> getAllMedecins() {

        return dao.getAllMedecins();
    }

    public List<MedecinModels> searchMedecins(
            String nom,
            String specialite,
            String lieu,
            Integer tauxMin,
            Integer tauxMax
    ) {

        return dao.searchMedecins(
                nom,
                specialite,
                lieu,
                tauxMin,
                tauxMax
        );
    }
}