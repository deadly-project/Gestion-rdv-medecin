package org.example.Routes;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.example.Controller.PatientControllerForAdmin;
import org.example.DTO.PatientAdminDTO;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/admin/patients")
public class AdminPatientRoutes
        extends HttpServlet {

    private final Gson gson =
            new Gson();

    private final PatientControllerForAdmin controller =
            new PatientControllerForAdmin();

    // GET
    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType(
                "application/json"
        );

        String idParam =
                request.getParameter("id");

        // GET BY ID
        if(idParam != null) {

            int id =
                    Integer.parseInt(idParam);

            PatientAdminDTO patient =
                    controller
                            .getPatientByIdForAdmin(id);

            if(patient == null) {

                response.setStatus(404);

                response.getWriter().write("""
                    {
                        "success":false,
                        "message":"Patient introuvable"
                    }
                """);

                return;
            }

            response.getWriter().write(
                    gson.toJson(patient)
            );

            return;
        }

        // GET ALL
        List<PatientAdminDTO> patients =
                controller
                        .getAllPatientsForAdmin();

        response.getWriter().write(
                gson.toJson(patients)
        );
    }

    // UPDATE
    @Override
    protected void doPut(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType(
                "application/json"
        );

        PatientAdminDTO patient =
                gson.fromJson(
                        JsonParser.parseReader(
                                request.getReader()
                        ),
                        PatientAdminDTO.class
                );

        boolean success =
                controller
                        .updatePatientForAdmin(patient);

        JsonObject result =
                new JsonObject();

        result.addProperty(
                "success",
                success
        );

        result.addProperty(
                "message",
                success
                        ? "Patient modifié"
                        : "Erreur modification"
        );

        response.getWriter().write(
                result.toString()
        );
    }

    // DELETE
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
                controller
                        .deletePatientForAdmin(id);

        JsonObject result =
                new JsonObject();

        result.addProperty(
                "success",
                success
        );

        result.addProperty(
                "message",
                success
                        ? "Patient supprimé"
                        : "Erreur suppression"
        );

        response.getWriter().write(
                result.toString()
        );
    }
}