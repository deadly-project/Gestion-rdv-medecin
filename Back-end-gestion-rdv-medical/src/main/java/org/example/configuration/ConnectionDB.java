package org.example.configuration;

import io.github.cdimascio.dotenv.Dotenv;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import jakarta.servlet.http.*;
public class ConnectionDB{
        private static final Dotenv dotenv = Dotenv
                .configure()
                .directory("/")
                .filename(".env")
                .load();

        private static final String DB_URL = dotenv.get("POSTGRES_DB_URL");
        private static final String POSTGRES_USER = dotenv.get("POSTGRES_USER");
        private static final String POSTGRES_PASSWORD = dotenv.get("POSTGRES_PASSWORD");

        static {
            try{
                Class.forName(
                        "org.postgresql.Driver"
                );
            } catch (ClassNotFoundException e){
                e.printStackTrace();
            }
        }

        public static Connection getConnection() throws SQLException {
            return DriverManager.getConnection(
                    DB_URL,
                    POSTGRES_USER,
                    POSTGRES_PASSWORD
            );
        };
}
