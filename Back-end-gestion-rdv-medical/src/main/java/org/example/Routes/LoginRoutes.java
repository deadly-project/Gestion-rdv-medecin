package org.example.Routes;


import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;

import jakarta.servlet.ServletException;
import org.example.configuration.ConnectionDB;

@WebServlet("/users")
public class LoginRoutes extends HttpServlet {

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    )throws IOException {
        response.setContentType("application/json");
        response.getWriter().write("""
                {
                    "method": "GET",
                    "message":"Liste users GET"
                }
                """);
    }

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response
    )throws IOException {
        BufferedReader reader = request.getReader();

        String body = reader.lines().reduce("", (acc, line) -> acc +line);
        String escapedBody = body.replace("\"", "\\\"");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");

        response.getWriter().write("""
                {
                    "%s";
                }
                """.formatted(body));
    }

    @Override
    protected void doPut(
            HttpServletRequest request,
            HttpServletResponse response
    )throws IOException {
        BufferedReader reader = request.getReader();

        String body = reader.lines().reduce("", (acc, line) -> acc +line);

        response.setContentType("application/json");
        response.getWriter().write("""
                {  
                    "method": "PUT",
                    "body":"%s (PUT)"
                }
                """.formatted(body));
    }


    @Override
    protected void doDelete(
            HttpServletRequest request,
            HttpServletResponse response
    )throws IOException {
        BufferedReader reader = request.getReader();

        String body = reader.lines().reduce("", (acc, line) -> acc +line);

        response.setContentType("application/json");
        response.getWriter().write("""
                {
                    "method": "DELETE",
                    "body":"%s (delete)"
                }
                """.formatted(body));
    }

}
