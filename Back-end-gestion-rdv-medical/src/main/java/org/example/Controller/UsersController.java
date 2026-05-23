package org.example.Controller;

import org.example.DAO.*;
import org.example.Models.*;

public class UsersController {

    private final UserDAO userDAO =
            new UserDAO();

    private final PatientDAO patientDAO =
            new PatientDAO();

    private final MedecinDAO medecinDAO =
            new MedecinDAO();

    public void createUser(

            UsersModel user,
            PatientsModels patient,
            MedecinModels medecin

    ) {

        // CLIENT
        if (
                user.getRole()
                        .equalsIgnoreCase("client")
        ) {

            user.setUser_status(
                    "validated"
            );
        }

        // MEDECIN
        else if (
                user.getRole()
                        .equalsIgnoreCase("medecin")
        ) {

            user.setUser_status(
                    "pending"
            );
        }

        // CREATE USER
        int userId =
                userDAO.createUser(user);

        if (userId == -1) {

            return;
        }

        // SAVE PATIENT
        if (
                user.getRole()
                        .equalsIgnoreCase("client")
        ) {

            patient.setId_user(userId);

            patientDAO.createPatient(patient);
        }

        // SAVE MEDECIN
        else if (
                user.getRole()
                        .equalsIgnoreCase("medecin")
        ) {

            medecin.setId_user(userId);

            medecinDAO.createMedecin(medecin);
        }
    }
}