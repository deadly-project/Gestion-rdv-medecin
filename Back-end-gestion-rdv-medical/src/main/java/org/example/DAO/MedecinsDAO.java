package org.example.DAO;

import org.example.DTO.TopMedecinDTO;
import org.example.Models.MedecinModels;
import org.example.configuration.ConnectionDB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class MedecinsDAO {

    // LISTE COMPLETE DES MEDECINS VALIDES
    public List<MedecinModels> getAllMedecins() {

        List<MedecinModels> medecins =
                new ArrayList<>();

        String sql = """
            SELECT
                m.id_user,
                m.nom_med,
                m.specialite,
                m.taux_horaire,
                m.lieu

            FROM medecins m

            INNER JOIN users u
                ON m.id_user = u.id

            WHERE u.user_status = 'validated'
        """;

        try (
                Connection connection =
                        ConnectionDB.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql);

                ResultSet result =
                        statement.executeQuery()
        ) {

            while(result.next()) {

                MedecinModels med =
                        new MedecinModels();

                med.setId_user(
                        result.getInt("id_user")
                );

                med.setNom_med(
                        result.getString("nom_med")
                );

                med.setSpecialite(
                        result.getString("specialite")
                );

                med.setTaux_horaire(
                        result.getInt("taux_horaire")
                );

                med.setLieu(
                        result.getString("lieu")
                );

                medecins.add(med);
            }

        } catch(Exception e) {
            e.printStackTrace();
        }

        return medecins;
    }

    // RECHERCHE DYNAMIQUE
    public List<MedecinModels> searchMedecins(
            String nom,
            String specialite,
            String lieu,
            Integer tauxMin,
            Integer tauxMax
    ) {

        List<MedecinModels> medecins =
                new ArrayList<>();

        StringBuilder sql =
                new StringBuilder("""
                SELECT
                    m.id_user,
                    m.nom_med,
                    m.specialite,
                    m.taux_horaire,
                    m.lieu

                FROM medecins m

                INNER JOIN users u
                    ON m.id_user = u.id

                WHERE u.user_status = 'validated'
                """);

        List<Object> params =
                new ArrayList<>();

        if(nom != null && !nom.isBlank()) {

            sql.append(
                    " AND m.nom_med ILIKE ?"
            );

            params.add(
                    "%" + nom + "%"
            );
        }

        if(specialite != null &&
                !specialite.isBlank()) {

            sql.append(
                    " AND m.specialite ILIKE ?"
            );

            params.add(
                    "%" + specialite + "%"
            );
        }

        if(lieu != null &&
                !lieu.isBlank()) {

            sql.append(
                    " AND m.lieu ILIKE ?"
            );

            params.add(
                    "%" + lieu + "%"
            );
        }

        if(tauxMin != null) {

            sql.append(
                    " AND m.taux_horaire >= ?"
            );

            params.add(tauxMin);
        }

        if(tauxMax != null) {

            sql.append(
                    " AND m.taux_horaire <= ?"
            );

            params.add(tauxMax);
        }

        try (
                Connection connection =
                        ConnectionDB.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(
                                sql.toString()
                        )
        ) {

            for(int i = 0; i < params.size(); i++) {

                statement.setObject(
                        i + 1,
                        params.get(i)
                );
            }

            ResultSet result =
                    statement.executeQuery();

            while(result.next()) {

                MedecinModels med =
                        new MedecinModels();

                med.setId_user(
                        result.getInt("id_user")
                );

                med.setNom_med(
                        result.getString("nom_med")
                );

                med.setSpecialite(
                        result.getString("specialite")
                );

                med.setTaux_horaire(
                        result.getInt("taux_horaire")
                );

                med.setLieu(
                        result.getString("lieu")
                );

                medecins.add(med);
            }

        } catch(Exception e) {
            e.printStackTrace();
        }

        return medecins;
    }

    public List<TopMedecinDTO> getTopMedecins() {

        List<TopMedecinDTO> list =
                new ArrayList<>();

        String sql = """
        SELECT
            m.id_user,
            m.nom_med,
            m.specialite,
            m.lieu,
            m.taux_horaire,
            COUNT(rv.id) AS total_consultations
        FROM medecins m
        LEFT JOIN rendez_vous rv
            ON rv.id_medecin = m.id_user
            AND rv.statut = 'validated'
        GROUP BY
            m.id_user,
            m.nom_med,
            m.specialite,
            m.lieu,
            m.taux_horaire
        ORDER BY total_consultations DESC
    """;

        try(
                Connection con =
                        ConnectionDB.getConnection();

                PreparedStatement stmt =
                        con.prepareStatement(sql)
        ){

            ResultSet rs =
                    stmt.executeQuery();

            while(rs.next()){

                TopMedecinDTO m =
                        new TopMedecinDTO();

                m.setIdMedecin(
                        rs.getInt("id_user")
                );

                m.setNomMed(
                        rs.getString("nom_med")
                );

                m.setSpecialite(
                        rs.getString("specialite")
                );

                m.setLieu(
                        rs.getString("lieu")
                );

                m.setTauxHoraire(
                        rs.getInt("taux_horaire")
                );

                m.setNombreConsultations(
                        rs.getInt("total_consultations")
                );

                list.add(m);
            }

        } catch(Exception e){
            e.printStackTrace();
        }

        return list;
    }
}