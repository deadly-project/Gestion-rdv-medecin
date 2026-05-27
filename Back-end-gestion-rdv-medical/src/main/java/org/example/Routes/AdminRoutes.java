package org.example.Routes;

import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.Models.UsersModel;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

import org.example.Controller.UsersController;

@WebServlet("/api/admin")
public class AdminRoutes extends HttpServlet {

    private final UsersController controller =
            new UsersController();
    private final Gson gson = new Gson();
    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        System.out.println("ADMIN ROUTE GET ALL USERS INFORMATION");
        response.setContentType("application/json");
        // USER ID venant du middleware
        String role =
                (String) request.getAttribute("role");

        // SECURITY
        if (!"admin".equals(role)) {

            response.setStatus(403);

            response.getWriter().write("""
                    {
                        "success": false,
                        "message": "Accès refusé"
                    }
                    """);

            return;
        }

        // USERS
        List<UsersModel> users =
                controller.getAllUser();

        response.getWriter().write(
                gson.toJson(users)
        );

        // LIST MEDECIN
    }

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        BufferedReader reader = request.getReader();

        String body = reader.lines()
                .reduce("", (acc, line) -> acc + line);

        response.setContentType("application/json");

        response.getWriter().write("""
            {
                "method":"POST",
                "body":"%s"
            }
        """.formatted(body));
    }

    @Override
    protected void doPut(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        BufferedReader reader = request.getReader();

        String body = reader.lines()
                .reduce("", (acc, line) -> acc + line);

        response.setContentType("application/json");

        response.getWriter().write("""
            {
                "method":"PUT",
                "body":"%s"
            }
        """.formatted(body));
    }

    @Override
    protected void doDelete(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType("application/json");

        response.getWriter().write("""
            {
                "method":"DELETE",
                "message":"Utilisateur supprimé"
            }
        """);
    }
}
