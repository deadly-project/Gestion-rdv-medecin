package org.example.Routes;

import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.example.Models.SlotModel;
import org.example.Services.SlotService;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/slots")
public class SlotRoutes extends HttpServlet {

    private final Gson gson =
            new Gson();

    private final SlotService slotService =
            new SlotService();

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType(
                "application/json"
        );

        try {

            String idParam =
                    request.getParameter(
                            "idMedecin"
                    );

            String date =
                    request.getParameter(
                            "date"
                    );

            if (
                    idParam == null ||
                            date == null
            ) {

                response.setStatus(
                        HttpServletResponse.SC_BAD_REQUEST
                );

                response.getWriter().write("""
                {
                  "success": false,
                  "message": "idMedecin et date sont requis"
                }
                """);

                return;
            }

            int idMedecin =
                    Integer.parseInt(idParam);

            List<SlotModel> slots =
                    slotService.getSlots(
                            idMedecin,
                            date
                    );

            response.getWriter().write(
                    gson.toJson(slots)
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