package org.example.DAO;

import org.example.Models.MedecinModels;
import org.example.configuration.ConnectionDB;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class MedecinDAO {

    public void createMedecin(
            MedecinModels medecin
    ) {

        String sql =
                "INSERT INTO medecins(id_user, nom_med, specialite, taux_horaire, lieu) " +
                        "VALUES (?, ?, ?, ?, ?)";

        try (

                Connection connection =
                        ConnectionDB.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)

        ) {

            statement.setInt(
                    1,
                    medecin.getId_user()
            );

            statement.setString(
                    2,
                    medecin.getNom_med()
            );

            statement.setString(
                    3,
                    medecin.getSpecialite()
            );

            statement.setInt(
                    4,
                    medecin.getTaux_horaire()
            );

            statement.setString(
                    5,
                    medecin.getLieu()
            );

            statement.executeUpdate();

        } catch (Exception e) {

            e.printStackTrace();
        }
    }
}