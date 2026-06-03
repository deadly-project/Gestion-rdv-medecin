package org.example.Routes;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.example.Controller.DisponibiliteController;
import org.example.Models.DisponibiliteModel;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/disponibilites")
public class DisponibiliteRoutes
        extends HttpServlet {

    private final Gson gson =
            new Gson();

    private final DisponibiliteController controller =
            new DisponibiliteController();

    // =========================
    // POUR LISTER LES DISPONIBILITER D'UN MEDECIN POUR UN MEDECIN OU UN PATIENT
    // =========================
    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType(
                "application/json"
        );

        String idParam =
                request.getParameter(
                        "idMedecin"
                );

        if(idParam == null){

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            response.getWriter().write("""
            {
                "success": false,
                "message": "idMedecin requis"
            }
            """);

            return;
        }

        int idMedecin =
                Integer.parseInt(idParam);

        List<DisponibiliteModel> dispos =
                controller.getDisponibilitesByMedecin(
                        idMedecin
                );

        response.getWriter().write(
                gson.toJson(dispos)
        );
    }

    // =========================
    // CREATION DE DISPONIBILITÉ D'UN MEDECIN
    // =========================
    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType(
                "application/json"
        );

        try {

            DisponibiliteModel dispo =
                    gson.fromJson(
                            request.getReader(),
                            DisponibiliteModel.class
                    );

            System.out.println(
                    "CREATION DISPO AVEC DATE = " +
                            dispo.getDate_disponibilite()
            );

            // ID récupéré depuis JWT
            Integer medecinId =
                    (Integer) request.getAttribute(
                            "userId"
                    );

            String role =
                    (String) request.getAttribute(
                            "role"
                    );

            if(
                    role == null ||
                            !role.equals("medecin")
            ){
                response.setStatus(
                        HttpServletResponse.SC_FORBIDDEN
                );

                response.getWriter().write("""
                {
                    "success": false,
                    "message": "Accès refusé"
                }
                """);

                return;
            }

            dispo.setId_medecin(
                    medecinId
            );

            boolean success =
                    controller.createDisponibilite(
                            dispo
                    );

            JsonObject result =
                    new JsonObject();

            result.addProperty(
                    "success",
                    success
            );

            result.addProperty(
                    "message",
                    success
                            ? "Disponibilité créée"
                            : "Erreur création"
            );

            response.getWriter().write(
                    result.toString()
            );

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );

            response.getWriter().write("""
            {
                "success": false,
                "message": "Erreur serveur"
            }
            """);
        }
    }

    // =========================
    // MODIFICATION D'UN DISPONIBILITÉ D'UN MEDECIN
    // =========================
    @Override
    protected void doPut(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType(
                "application/json"
        );

        try {

            DisponibiliteModel dispo =
                    gson.fromJson(
                            request.getReader(),
                            DisponibiliteModel.class
                    );

            Integer medecinId =
                    (Integer) request.getAttribute(
                            "userId"
                    );

            dispo.setId_medecin(
                    medecinId
            );

            boolean success =
                    controller.updateDisponibilite(
                            dispo
                    );

            JsonObject result =
                    new JsonObject();

            result.addProperty(
                    "success",
                    success
            );

            result.addProperty(
                    "message",
                    success
                            ? "Disponibilité modifiée"
                            : "Erreur modification"
            );

            response.getWriter().write(
                    result.toString()
            );

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    // =========================
    // SUPPRESSION DE DISPONIBILITÉ D'UN MEDECIN
    // =========================
    @Override
    protected void doDelete(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType(
                "application/json"
        );

        int id =
                Integer.parseInt(
                        request.getParameter("id")
                );

        boolean success =
                controller.deleteDisponibilite(
                        id
                );

        JsonObject result =
                new JsonObject();

        result.addProperty(
                "success",
                success
        );

        result.addProperty(
                "message",
                success
                        ? "Disponibilité supprimée"
                        : "Erreur suppression"
        );

        response.getWriter().write(
                result.toString()
        );
    }
}