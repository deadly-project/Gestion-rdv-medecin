package org.example.Routes;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import org.example.Controller.AuthController;

@WebServlet("/login")
public class LoginRoutes extends HttpServlet {

    private final AuthController controller =
            new AuthController();

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        response.setContentType("application/json");

        JsonObject json =
                JsonParser.parseReader(request.getReader())
                        .getAsJsonObject();

        String username = json.get("username").getAsString();
        String password = json.get("password").getAsString();

        String token =
                controller.login(username, password);

        if (token == null) {

            response.setStatus(401);

            response.getWriter().write("""
                    {"error":"Invalid credentials"}
                    """);
            return;
        }

        response.getWriter().write(
                """
                {
                    "token":"%s"
                }
                """.formatted(token)
        );
    }
}
