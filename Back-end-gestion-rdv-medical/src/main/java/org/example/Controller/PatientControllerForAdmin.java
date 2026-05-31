package org.example.Controller;

import org.example.DAO.PatientForAdminDAO;
import org.example.DTO.PatientAdminDTO;

import java.util.List;

public class PatientControllerForAdmin {

    private final PatientForAdminDAO patientForAdminDAO =
            new PatientForAdminDAO();

    public List<PatientAdminDTO> getAllPatientsForAdmin() {

        return patientForAdminDAO
                .getAllPatientsForAdmin();
    }

    public PatientAdminDTO getPatientByIdForAdmin(
            int id
    ) {

        return patientForAdminDAO
                .getPatientByIdForAdmin(id);
    }

    public boolean updatePatientForAdmin(
            PatientAdminDTO patient
    ) {

        return patientForAdminDAO
                .updatePatientForAdmin(patient);
    }

    public boolean deletePatientForAdmin(
            int id
    ) {

        return patientForAdminDAO
                .deletePatientForAdmin(id);
    }
}