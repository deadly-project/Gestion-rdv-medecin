package org.example.DAO;

import org.example.Models.PatientsModels;
import org.example.configuration.ConnectionDB;
import org.example.DTO.PatientAdminDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Date;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class PatientForAdminDAO {

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

    //FOR ADMINISTRATEUR
    public List<PatientAdminDTO> getAllPatientsForAdmin() {

        List<PatientAdminDTO> patients =
                new ArrayList<>();

        String sql = """
        SELECT
            u.id,
            u.username,
            u.email,
            u.role,
            u.user_status,

            p.nom_pat,
            p.datenais

        FROM users u

        INNER JOIN patients p
        ON u.id = p.id_user
    """;

        try (
                Connection connection =
                        ConnectionDB.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql);

                ResultSet result =
                        statement.executeQuery()
        ) {

            while (result.next()) {

                PatientAdminDTO patient =
                        new PatientAdminDTO();

                patient.setId(result.getInt("id"));
                patient.setUsername(result.getString("username"));
                patient.setEmail(result.getString("email"));
                patient.setRole(result.getString("role"));
                patient.setUser_status(result.getString("user_status"));

                patient.setNom_pat(result.getString("nom_pat"));
                patient.setDatenais(result.getString("datenais"));

                patients.add(patient);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return patients;
    }


    // GET BY ID
    public PatientAdminDTO getPatientByIdForAdmin(
            int id
    ) {

        String sql = """
            SELECT
                u.id,
                u.username,
                u.email,
                u.role,
                u.user_status,

                p.nom_pat,
                p.datenais

            FROM users u

            INNER JOIN patients p
            ON u.id = p.id_user

            WHERE u.id = ?
        """;

        try (
                Connection connection =
                        ConnectionDB.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setInt(1, id);

            ResultSet result =
                    statement.executeQuery();

            if(result.next()) {

                PatientAdminDTO patient =
                        new PatientAdminDTO();

                patient.setId(
                        result.getInt("id")
                );

                patient.setUsername(
                        result.getString("username")
                );

                patient.setEmail(
                        result.getString("email")
                );

                patient.setRole(
                        result.getString("role")
                );

                patient.setUser_status(
                        result.getString("user_status")
                );

                patient.setNom_pat(
                        result.getString("nom_pat")
                );

                patient.setDatenais(
                        result.getString("datenais")
                );

                return patient;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    // UPDATE
    public boolean updatePatientForAdmin(
            PatientAdminDTO patient
    ) {

        String sqlUsers = """
            UPDATE users
            SET
                username = ?,
                email = ?,
                user_status = ?
            WHERE id = ?
        """;

        String sqlPatient = """
            UPDATE patients
            SET
                nom_pat = ?,
                datenais = ?
            WHERE id_user = ?
        """;

        try (
                Connection connection =
                        ConnectionDB.getConnection()
        ) {

            connection.setAutoCommit(false);

            try (
                    PreparedStatement stmtUsers =
                            connection.prepareStatement(sqlUsers)
            ) {

                stmtUsers.setString(
                        1,
                        patient.getUsername()
                );

                stmtUsers.setString(
                        2,
                        patient.getEmail()
                );

                stmtUsers.setString(
                        3,
                        patient.getUser_status()
                );

                stmtUsers.setInt(
                        4,
                        patient.getId()
                );

                stmtUsers.executeUpdate();
            }

            try (
                    PreparedStatement stmtPatient =
                            connection.prepareStatement(sqlPatient)
            ) {

                stmtPatient.setString(
                        1,
                        patient.getNom_pat()
                );

                stmtPatient.setDate(
                        2,
                        Date.valueOf(patient.getDatenais())
                );

                stmtPatient.setInt(
                        3,
                        patient.getId()
                );

                stmtPatient.executeUpdate();
            }

            connection.commit();

            return true;

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    // DELETE
    public boolean deletePatientForAdmin(
            int id
    ) {

        String sql =
                "DELETE FROM users WHERE id=?";

        try (
                Connection connection =
                        ConnectionDB.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setInt(1, id);

            int rows =
                    statement.executeUpdate();

            return rows > 0;

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }
}