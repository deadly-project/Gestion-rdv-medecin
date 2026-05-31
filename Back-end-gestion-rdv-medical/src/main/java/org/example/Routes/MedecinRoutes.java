package org.example.Routes;

import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.example.Controller.MedecinsController;
import org.example.Models.MedecinModels;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/medecins")
public class MedecinRoutes extends HttpServlet {

    private final Gson gson =
            new Gson();

    private final MedecinsController controller =
            new MedecinsController();

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType(
                "application/json"
        );

        String nom =
                request.getParameter("nom");

        String specialite =
                request.getParameter("specialite");

        String lieu =
                request.getParameter("lieu");

        String tauxMinStr =
                request.getParameter("tauxMin");

        String tauxMaxStr =
                request.getParameter("tauxMax");

        Integer tauxMin = null;
        Integer tauxMax = null;

        if(tauxMinStr != null &&
                !tauxMinStr.isBlank()) {

            tauxMin =
                    Integer.parseInt(
                            tauxMinStr
                    );
        }

        if(tauxMaxStr != null &&
                !tauxMaxStr.isBlank()) {

            tauxMax =
                    Integer.parseInt(
                            tauxMaxStr
                    );
        }

        List<MedecinModels> result;

        boolean filtrePresent =
                nom != null ||
                        specialite != null ||
                        lieu != null ||
                        tauxMin != null ||
                        tauxMax != null;

        if(filtrePresent) {

            result =
                    controller.searchMedecins(
                            nom,
                            specialite,
                            lieu,
                            tauxMin,
                            tauxMax
                    );

        } else {

            result =
                    controller.getAllMedecins();
        }

        response.getWriter().write(
                gson.toJson(result)
        );
    }
}