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
        response.setCharacterEncoding("UTF-8");

        JsonObject json =
                JsonParser.parseReader(
                        request.getReader()
                ).getAsJsonObject();

        String username =
                json.get("username")
                        .getAsString();

        String password =
                json.get("password")
                        .getAsString();

        JsonObject result =
                controller.login(
                        username,
                        password
                );

        // LOGIN FAILED
        if (
                !result.get("success")
                        .getAsBoolean()
        ) {

            response.setStatus(200);
        }

        response.getWriter().write(
                result.toString()
        );
    }
}