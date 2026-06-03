package org.example.Routes;

import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.Controller.RendezVousController;

import java.io.IOException;

@WebServlet("/api/rendezvous")
public class RendezVousRoutes
        extends HttpServlet {

    private final Gson gson =
            new Gson();

    private final RendezVousController controller =
            new RendezVousController();

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        Integer patientId =
                (Integer)
                        request.getAttribute(
                                "userId"
                        );

        response.setContentType(
                "application/json"
        );

        response.getWriter().write(
                gson.toJson(
                        controller
                                .getPatientRdv(
                                        patientId
                                )
                )
        );
    }
}