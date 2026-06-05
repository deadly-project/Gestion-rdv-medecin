package org.example.Routes;

import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.Controller.MedecinsController;

import java.io.IOException;

@WebServlet("/api/top-medecins")
public class AdminTopMedecinRoutes extends HttpServlet {

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
        System.out.println("LISTE DES TOPS MEDECINS");
        response.getWriter().write(
                gson.toJson(
                        controller.getTopMedecins()
                )
        );
    }
}