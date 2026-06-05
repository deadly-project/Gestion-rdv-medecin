package org.example;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

import org.example.DAO.UserDAO;
import org.example.Models.UsersModel;

@WebListener
public class AdminInitializer
        implements ServletContextListener {

    private static final Dotenv dotenv = Dotenv
            .configure()
            .directory("/")
            .filename(".env")
            .load();

    private static final String ADMIN_USERNAME = dotenv.get("ADMIN_USERNAME");
    private static final String ADMIN_PASSWORD = dotenv.get("ADMIN_PASSWORD");
    private static final String ADMIN_EMAIL = dotenv.get("ADMIN_EMAIL");
    private static final String MDP_APP_EMAIL = dotenv.get("MDP_APP_EMAIL");

    @Override
    public void contextInitialized(
            ServletContextEvent sce
    ) {

        try {

            UserDAO dao =
                    new UserDAO();

            // CHECK USERNAME
            boolean exists =
                    dao.usernameExists(ADMIN_USERNAME);

            if (exists) {

                System.out.println(
                        "✅ Admin existe déjà"
                );
                System.out.println(MDP_APP_EMAIL);

                return;
            }

            // CREATE ADMIN
            UsersModel admin =
                    new UsersModel();

            admin.setUsername(
                    ADMIN_USERNAME
            );

            admin.setEmail(
                    ADMIN_EMAIL
            );

            admin.setPassword(
                    ADMIN_PASSWORD
            );

            admin.setRole(
                    "admin"
            );

            admin.setUser_status(
                    "validated"
            );

            dao.createUser(admin);

            System.out.println(
                    "✅ Compte admin créé"
            );

        } catch (Exception e) {

            e.printStackTrace();
        }
    }
}