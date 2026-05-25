package org.example.Routes;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;

@WebServlet("/api/admin")
public class AdminRoutes extends HttpServlet {
    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        System.out.println("ADMIN ROUTE");
        response.setContentType("application/json");

        response.getWriter().write("""
            {
                "method":"GET",
                "message":"Liste des utilisateurs"
            }
        """);
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
