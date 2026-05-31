package org.example.Controller;

import org.example.DAO.PatientDAO;
import org.example.DTO.PatientAdminDTO;

import java.util.List;

public class PatientControllerForAdmin {

    private final PatientDAO patientDAO =
            new PatientDAO();

    public List<PatientAdminDTO> getAllPatientsForAdmin() {

        return patientDAO
                .getAllPatientsForAdmin();
    }

    public PatientAdminDTO getPatientByIdForAdmin(
            int id
    ) {

        return patientDAO
                .getPatientByIdForAdmin(id);
    }

    public boolean updatePatientForAdmin(
            PatientAdminDTO patient
    ) {

        return patientDAO
                .updatePatientForAdmin(patient);
    }

    public boolean deletePatientForAdmin(
            int id
    ) {

        return patientDAO
                .deletePatientForAdmin(id);
    }
}