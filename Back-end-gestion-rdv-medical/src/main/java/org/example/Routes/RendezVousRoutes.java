package org.example.Routes;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.Controller.RendezVousController;
import org.example.Models.RendezVousModel;

import java.io.IOException;

@WebServlet("/api/rendezvous")
public class RendezVousRoutes extends HttpServlet {

    private final Gson gson =
            new Gson();

    private final RendezVousController controller =
            new RendezVousController();

    // =========================
    // LISTE DES RDV DU PATIENT et DU MEDECIN
    // =========================
    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType(
                "application/json"
        );

        try {

            Integer userId =
                    (Integer) request.getAttribute(
                            "userId"
                    );

            String role =
                    (String) request.getAttribute(
                            "role"
                    );

            if ("client".equals(role)) {

                response.getWriter().write(
                        gson.toJson(
                                controller.getByPatient(
                                        userId
                                )
                        )
                );

            } else if ("medecin".equals(role)) {

                response.getWriter().write(
                        gson.toJson(
                                controller.getByMedecin(
                                        userId
                                )
                        )
                );

            } else {

                response.setStatus(
                        HttpServletResponse.SC_FORBIDDEN
                );

                response.getWriter().write("""
            {
                "success": false,
                "message": "Accès refusé"
            }
            """);
            }

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );
        }
    }

    // =========================
    // CREATION RDV
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

            Integer patientId =
                    (Integer) request.getAttribute(
                            "userId"
                    );

            String role =
                    (String) request.getAttribute(
                            "role"
                    );

            if (
                    role == null ||
                            !role.equals("client")
            ) {

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

            RendezVousModel rdv =
                    gson.fromJson(
                            request.getReader(),
                            RendezVousModel.class
                    );

            rdv.setId_patient(
                    patientId
            );

            boolean existe =
                    controller.slotExiste(
                            rdv.getId_medecin(),
                            rdv.getDate_rdv(),
                            rdv.getHeure_debut(),
                            rdv.getHeure_fin()
                    );

            if (existe) {

                response.setStatus(
                        HttpServletResponse.SC_CONFLICT
                );

                response.getWriter().write("""
                {
                  "success": false,
                  "message": "Ce créneau est déjà réservé"
                }
                """);

                return;
            }

            boolean success =
                    controller.create(rdv);

            JsonObject result =
                    new JsonObject();

            result.addProperty(
                    "success",
                    success
            );

            result.addProperty(
                    "message",
                    success
                            ? "Rendez-vous créé"
                            : "Erreur lors de la création"
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
    // VALIDER / REFUSER / MODIFIER
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

            String action =
                    request.getParameter(
                            "action"
                    );

            boolean success = false;

            if ("validate".equals(action)) {

                int id =
                        Integer.parseInt(
                                request.getParameter("id")
                        );

                success =
                        controller.validate(id);
            }

            else if ("refuse".equals(action)) {

                int id =
                        Integer.parseInt(
                                request.getParameter("id")
                        );

                success =
                        controller.refuse(id);
            }

            else if ("update".equals(action)) {

                RendezVousModel rdv =
                        gson.fromJson(
                                request.getReader(),
                                RendezVousModel.class
                        );

                success =
                        controller.update(rdv);
            }

            JsonObject result =
                    new JsonObject();

            result.addProperty(
                    "success",
                    success
            );

            result.addProperty(
                    "message",
                    success
                            ? "Opération réussie"
                            : "Échec de l'opération"
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
    // ANNULER RDV
    // =========================
    @Override
    protected void doDelete(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType(
                "application/json"
        );

        try {

            int id =
                    Integer.parseInt(
                            request.getParameter(
                                    "id"
                            )
                    );

            boolean success =
                    controller.cancel(id);

            JsonObject result =
                    new JsonObject();

            result.addProperty(
                    "success",
                    success
            );

            result.addProperty(
                    "message",
                    success
                            ? "Rendez-vous annulé"
                            : "Erreur annulation"
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
}