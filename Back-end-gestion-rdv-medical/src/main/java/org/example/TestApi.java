package org.example;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;

// On importe votre classe de configuration
import org.example.configuration.ConnectionDB;

@WebServlet("/test")
public class TestApi extends HttpServlet {

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws ServletException, IOException {

        response.setContentType("text/plain;charset=UTF-8");
        PrintWriter out = response.getWriter();

        // On utilise un try-with-resources pour s'assurer que la connexion se ferme automatiquement
        try (Connection conn = ConnectionDB.getConnection()) {

            if (conn != null && !conn.isClosed()) {
                out.println("Tomcat oui !");
                out.println("Connexion à la base de données PostgreSQL réussie !");
            } else {
                out.println("Tomcat oui... mais la connexion est nulle ou fermée.");
            }

        } catch (SQLException e) {
            out.println("Tomcat oui, MAIS échec de la connexion à la base de données !");
            out.println("Erreur SQL : " + e.getMessage());

            // Log de l'erreur dans la console du serveur pour débugger plus facilement
            e.printStackTrace();
        }
    }
}