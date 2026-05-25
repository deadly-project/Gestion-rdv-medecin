package org.example.Routes;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.example.Controller.UsersController;

import org.example.Models.UsersModel;
import org.example.Models.PatientsModels;
import org.example.Models.MedecinModels;

import java.io.BufferedReader;
import java.io.IOException;

@WebServlet("/register/*")
public class RegisterRoutes extends HttpServlet {

    private final UsersController controller =
            new UsersController();

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");

        try {

            // LECTURE BODY JSON
            BufferedReader reader =
                    request.getReader();

            String body =
                    reader.lines()
                            .reduce(
                                    "",
                                    (acc, line)
                                            -> acc + line
                            );

            // CONVERTIR JSON
            JsonObject jsonObject =
                    JsonParser.parseString(body)
                            .getAsJsonObject();

            // NOM COMPLET
            String nomComplet =

                    jsonObject.get("nom")
                            .getAsString()

                            + " " +

                            jsonObject.get("prenom")
                                    .getAsString();

            // USER MODEL
            UsersModel user =
                    new UsersModel();

            user.setUsername(
                    jsonObject.get("username")
                            .getAsString()
            );

            user.setEmail(
                    jsonObject.get("email")
                            .getAsString()
            );

            user.setPassword(
                    jsonObject.get("password")
                            .getAsString()
            );

            user.setRole(
                    jsonObject.get("role")
                            .getAsString()
            );

            // STATUS AUTOMATIQUE
            if (
                    user.getRole()
                            .equalsIgnoreCase("client")
            ) {

                user.setUser_status(
                        "validated"
                );

            } else if (
                    user.getRole()
                            .equalsIgnoreCase("medecin")
            ) {

                user.setUser_status(
                        "pending"
                );
            }

            // DETAILS
            JsonObject details =
                    jsonObject.getAsJsonObject(
                            "details"
                    );

            // PATIENT
            PatientsModels patient =
                    null;

            // MEDECIN
            MedecinModels medecin =
                    null;

            // CLIENT
            if (
                    user.getRole()
                            .equalsIgnoreCase("client")
            ) {

                patient =
                        new PatientsModels();

                patient.setNom_pat(
                        nomComplet
                );

                patient.setDatenais(
                        details.get("datenais")
                                .getAsString()
                );
            }

            // MEDECIN
            else if (
                    user.getRole()
                            .equalsIgnoreCase("medecin")
            ) {

                medecin =
                        new MedecinModels();

                medecin.setNom_med(
                        nomComplet
                );

                medecin.setSpecialite(
                        details.get("specialité")
                                .getAsString()
                );

                medecin.setTaux_horaire(
                        details.get("taux_horaire")
                                .getAsInt()
                );

                medecin.setLieu(
                        details.get("lieu")
                                .getAsString()
                );
            }

            // ENREGISTREMENT
            JsonObject result =  controller.createUser(
                    user,
                    patient,
                    medecin
            );

            response.setStatus(201);

            response.getWriter().write(
                    result.toString()
            );

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(500);

            response.getWriter().write("""
                    {
                        "success": false,
                        "message": "Erreur serveur"
                    }
                    """);
        }
    }

    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException{
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");

        response.setContentType(
                "application/json"
        );

        response.setCharacterEncoding(
                "UTF-8"
        );

        JsonObject json =
                new JsonObject();

        try {

            // URL
            // /register/johan

            String path =
                    request.getPathInfo();

            if (
                    path == null ||
                            path.equals("/")
            ) {

                json.addProperty(
                        "available",
                        false
                );

                json.addProperty(
                        "message",
                        "Username manquant"
                );

                response.getWriter().write(
                        json.toString()
                );

                return;
            }

            // REMOVE "/"
            String username =
                    path.substring(1);

            boolean exists =
                    controller.usernameExists(
                            username
                    );

            // USERNAME EXISTE
            if (exists) {

                json.addProperty(
                        "available",
                        false
                );

                json.addProperty(
                        "message",
                        "Username déjà utilisé"
                );

            } else {

                json.addProperty(
                        "available",
                        true
                );

                json.addProperty(
                        "message",
                        "Username disponible"
                );
            }

            response.getWriter().write(
                    json.toString()
            );

        } catch (Exception e) {

            e.printStackTrace();

            json.addProperty(
                    "available",
                    false
            );

            json.addProperty(
                    "message",
                    "Erreur serveur"
            );

            response.getWriter().write(
                    json.toString()
            );
        }
    }
}