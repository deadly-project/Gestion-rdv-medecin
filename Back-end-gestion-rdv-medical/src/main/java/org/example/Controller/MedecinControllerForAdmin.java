package org.example.Controller;

import org.example.DTO.MedecinAdminDTO;
import org.example.DAO.MedecinForAdminDAO;

import java.util.List;

public class MedecinControllerForAdmin {

    private final MedecinForAdminDAO medecinForAdminDAO = new MedecinForAdminDAO();
    // GET LIST
    public List<MedecinAdminDTO> getAllMedecinsForAdmin() {

        return medecinForAdminDAO.getAllMedecinsForAdmin();
    }

    // UPDATE
    public boolean updateMedecinForAdmin(
            MedecinAdminDTO medecin
    ) {

        return medecinForAdminDAO
                .updateMedecinForAdmin(medecin);
    }

    // DELETE
    public boolean deleteMedecinForAdmin(
            int id
    ) {

        return medecinForAdminDAO
                .deleteMedecinForAdmin(id);
    }

    //RECHERCHE PAR ID
    public MedecinAdminDTO getMedecinByIdForAdmin(
            int id
    ) {

        return medecinForAdminDAO
                .getMedecinByIdForAdmin(id);
    }
}
