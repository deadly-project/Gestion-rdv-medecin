package org.example.Controller;

import org.example.DTO.MedecinAdminDTO;
import org.example.DAO.MedecinDAO;

import java.util.List;

public class MedecinController {

    private final MedecinDAO medecinDAO = new MedecinDAO();
    // GET LIST
    public List<MedecinAdminDTO> getAllMedecinsForAdmin() {

        return medecinDAO.getAllMedecinsForAdmin();
    }

    // UPDATE
    public boolean updateMedecinForAdmin(
            MedecinAdminDTO medecin
    ) {

        return medecinDAO
                .updateMedecinForAdmin(medecin);
    }

    // DELETE
    public boolean deleteMedecinForAdmin(
            int id
    ) {

        return medecinDAO
                .deleteMedecinForAdmin(id);
    }
}
