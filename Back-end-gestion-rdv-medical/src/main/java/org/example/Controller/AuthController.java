package org.example.Controller;

import com.google.gson.JsonObject;
import org.example.DAO.UserDAO;
import org.example.Models.UsersModel;
import org.example.configuration.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;

public class AuthController {

    private final UserDAO dao = new UserDAO();

    public JsonObject login(
            String username,
            String password
    ) {

        JsonObject response = new JsonObject();

        UsersModel user = dao.login(username);

        // USER NOT FOUND
        if (user == null) {

            response.addProperty(
                    "success",
                    false
            );

            response.addProperty(
                    "message",
                    "Utilisateur introuvable"
            );

            return response;
        }

        // PASSWORD CHECK
        boolean check = BCrypt.checkpw(
                password,
                user.getPassword()
        );

        if (!check) {

            response.addProperty(
                    "success",
                    false
            );

            response.addProperty(
                    "message",
                    "Mot de passe incorrect"
            );

            return response;
        }

        // STATUS CHECK
        if (
                user.getUser_status()
                        .equalsIgnoreCase("pending")
        ) {

            response.addProperty(
                    "success",
                    false
            );

            response.addProperty(
                    "message",
                    "Votre compte est en attente de validation"
            );

            return response;
        }

        // TOKEN
        String token =
                JwtUtil.generateToken(
                        user.getUsername(),
                        user.getRole(),
                        user.getId()
                );

        response.addProperty(
                "success",
                true
        );

        response.addProperty(
                "token",
                token
        );

        response.addProperty(
                "id",
                user.getId()
        );


        response.addProperty(
                "role",
                user.getRole()
        );

        response.addProperty(
                "message",
                "Bienvenu"
        );

        return response;
    }
}