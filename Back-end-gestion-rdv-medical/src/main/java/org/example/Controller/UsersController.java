package org.example.Controller;

import com.google.gson.JsonObject;
import org.example.DAO.*;
import org.example.Models.*;

public class UsersController {

    private final UserDAO userDAO =
            new UserDAO();

    private final PatientDAO patientDAO =
            new PatientDAO();

    private final MedecinDAO medecinDAO =
            new MedecinDAO();

    public JsonObject createUser(

            UsersModel user,
            PatientsModels patient,
            MedecinModels medecin

    ) {

        JsonObject response =
                new JsonObject();

        // VERIFY USERNAME
        if (
                userDAO.usernameExists(
                        user.getUsername()
                )
        ) {

            response.addProperty(
                    "success",
                    false
            );

            response.addProperty(
                    "message",
                    "Username déjà utilisé"
            );

            return response;
        }

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

            response.addProperty(
                    "success",
                    false
            );

            response.addProperty(
                    "message",
                    "Erreur lors de la création"
            );

            return response;
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

        response.addProperty(
                "success",
                true
        );

        response.addProperty(
                "message",
                "Compte créé avec succès"
        );

        return response;
    }

    public boolean usernameExists(
            String username
    ) {

        return userDAO.usernameExists(
                username
        );
    }

    public UsersModel getProfile(int id) {

        return userDAO.getProfile(id);
    }

}