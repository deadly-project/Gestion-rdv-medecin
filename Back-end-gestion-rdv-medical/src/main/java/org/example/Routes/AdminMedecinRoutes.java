package org.example.Routes;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.example.Controller.MedecinController;
import org.example.DTO.MedecinAdminDTO;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/admin/medecins")
public class AdminMedecinRoutes
        extends HttpServlet {

    private final Gson gson =
            new Gson();

    private final MedecinController controller =
            new MedecinController();

    // GET LIST
    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType(
                "application/json"
        );

        List<MedecinAdminDTO> medecins =
                controller.getAllMedecinsForAdmin();

        response.getWriter().write(
                gson.toJson(medecins)
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

        JsonObject json =
                JsonParser.parseReader(
                        request.getReader()
                ).getAsJsonObject();

        MedecinAdminDTO med =
                gson.fromJson(
                        json,
                        MedecinAdminDTO.class
                );

        boolean success =
                controller
                        .updateMedecinForAdmin(med);

        JsonObject result =
                new JsonObject();

        result.addProperty(
                "success",
                success
        );

        result.addProperty(
                "message",
                success
                        ? "Médecin modifié"
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
                        .deleteMedecinForAdmin(id);

        JsonObject result =
                new JsonObject();

        result.addProperty(
                "success",
                success
        );

        result.addProperty(
                "message",
                success
                        ? "Médecin supprimé"
                        : "Erreur suppression"
        );

        response.getWriter().write(
                result.toString()
        );
    }
}