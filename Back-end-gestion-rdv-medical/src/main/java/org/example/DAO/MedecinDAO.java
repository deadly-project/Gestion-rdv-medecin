package org.example.DAO;

import org.example.Models.MedecinModels;
import org.example.configuration.ConnectionDB;
import org.example.DTO.MedecinAdminDTO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;


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


    //FOR ADMINISTRATEUR
    public List<MedecinAdminDTO> getAllMedecinsForAdmin() {

        List<MedecinAdminDTO> medecins =
                new ArrayList<>();

        String sql = """
        SELECT
            u.id,
            u.username,
            u.email,
            u.role,
            u.user_status,

            m.nom_med,
            m.specialite,
            m.taux_horaire,
            m.lieu

        FROM users u

        INNER JOIN medecins m
        ON u.id = m.id_user
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

                MedecinAdminDTO med =
                        new MedecinAdminDTO();

                med.setId(result.getInt("id"));
                med.setUsername(result.getString("username"));
                med.setEmail(result.getString("email"));
                med.setRole(result.getString("role"));
                med.setUser_status(result.getString("user_status"));

                med.setNom_med(result.getString("nom_med"));
                med.setSpecialite(result.getString("specialite"));
                med.setTaux_horaire(result.getInt("taux_horaire"));
                med.setLieu(result.getString("lieu"));

                medecins.add(med);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return medecins;
    }

    // UPDATE MEDECIN
    public boolean updateMedecinForAdmin(
            MedecinAdminDTO medecin
    ) {

        String sqlUsers = """
        UPDATE users
        SET
            username = ?,
            email = ?,
            role = ?,
            user_status = ?
        WHERE id = ?
    """;

        String sqlMedecin = """
        UPDATE medecins
        SET
            nom_med = ?,
            specialite = ?,
            taux_horaire = ?,
            lieu = ?
        WHERE id_user = ?
    """;

        try (
                Connection connection =
                        ConnectionDB.getConnection()
        ) {

            connection.setAutoCommit(false);

            // UPDATE USERS
            try (
                    PreparedStatement psUsers =
                            connection.prepareStatement(sqlUsers)
            ) {

                psUsers.setString(1, medecin.getUsername());
                psUsers.setString(2, medecin.getEmail());
                psUsers.setString(3, medecin.getRole());
                psUsers.setString(4, medecin.getUser_status());
                psUsers.setInt(5, medecin.getId());

                psUsers.executeUpdate();
            }

            // UPDATE MEDECINS
            try (
                    PreparedStatement psMed =
                            connection.prepareStatement(sqlMedecin)
            ) {

                psMed.setString(1, medecin.getNom_med());
                psMed.setString(2, medecin.getSpecialite());
                psMed.setInt(3, medecin.getTaux_horaire());
                psMed.setString(4, medecin.getLieu());
                psMed.setInt(5, medecin.getId());

                psMed.executeUpdate();
            }

            connection.commit();

            return true;

        } catch (Exception e) {

            e.printStackTrace();
        }

        return false;
    }

    // DELETE MEDECIN
    public boolean deleteMedecinForAdmin(
            int id
    ) {

        String sql =
                "DELETE FROM users WHERE id = ?";

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