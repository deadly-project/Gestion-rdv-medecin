package org.example.DAO;

import org.example.Models.PatientsModels;
import org.example.configuration.ConnectionDB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Date;

public class PatientDAO {

    public void createPatient(
            PatientsModels patient
    ) {

        String sql =
                "INSERT INTO patients(id_user, nom_pat, datenais) " +
                        "VALUES (?, ?, ?)";

        try (

                Connection connection =
                        ConnectionDB.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)

        ) {

            statement.setInt(
                    1,
                    patient.getId_user()
            );

            statement.setString(
                    2,
                    patient.getNom_pat()
            );

            // ✅ CONVERSION STRING -> SQL DATE
            statement.setDate(
                    3,
                    Date.valueOf(patient.getDatenais())
            );

            statement.executeUpdate();

        } catch (Exception e) {

            e.printStackTrace();
        }
    }
}