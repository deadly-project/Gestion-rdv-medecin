package org.example.Routes;

import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import org.example.Controller.UsersController;
import org.example.Models.UsersModel;

import java.io.IOException;

@WebServlet("/api/profile")
public class ProfileRoutes extends HttpServlet {

    private final UsersController controller =
            new UsersController();

    private final Gson gson =
            new Gson();

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // USER ID venant du middleware
        int userId =
                (int) request.getAttribute("userId");

        UsersModel user =
                controller.getProfile(userId);

        if (user == null) {

            response.setStatus(404);

            response.getWriter().write("""
                    {
                        "message":"Utilisateur introuvable"
                    }
                    """);

            return;
        }

        response.getWriter().write(
                gson.toJson(user)
        );
    }
}