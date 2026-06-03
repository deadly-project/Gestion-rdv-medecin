package org.example.DAO;

import org.example.Models.DisponibiliteModel;
import org.example.configuration.ConnectionDB;

import java.sql.*;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class DisponibiliteDAO {

    // CREATION DE DISPONIBILITÉ PAR UN MEDECIN
    public boolean createDisponibilite(
            DisponibiliteModel dispo
    ) {

        String sql = """
            INSERT INTO disponibilites_medecin(
                id_medecin,
                date_disponibilite,
                heure_debut,
                heure_fin
            )
            VALUES (?, ?, ?, ?)
        """;

        try(
                Connection con =
                        ConnectionDB.getConnection();

                PreparedStatement stmt =
                        con.prepareStatement(sql)
        ){

            stmt.setInt(
                    1,
                    dispo.getId_medecin()
            );

            stmt.setDate(
                    2,
                    Date.valueOf(
                            dispo.getDate_disponibilite()
                    )
            );

            stmt.setTime(
                    3,
                    Time.valueOf(
                            LocalTime.parse(
                                    dispo.getHeure_debut()
                            )
                    )
            );

            stmt.setTime(
                    4,
                    Time.valueOf(
                            LocalTime.parse(
                            dispo.getHeure_fin()
                            )
                    )
            );

            return stmt.executeUpdate() > 0;

        } catch (Exception e){

            e.printStackTrace();
        }

        return false;
    }

    // LIST DE DISPONIBILITÉ POUR UN MEDECIN VU PAR UN PATIENT ET PAR UN MEDECIN
    public List<DisponibiliteModel>
    getDisponibilitesByMedecin(
            int idMedecin
    ){

        List<DisponibiliteModel> list =
                new ArrayList<>();

        String sql = """
            SELECT *
            FROM disponibilites_medecin
            WHERE id_medecin = ?
            ORDER BY date_disponibilite
        """;

        try(
                Connection con =
                        ConnectionDB.getConnection();

                PreparedStatement stmt =
                        con.prepareStatement(sql)
        ){

            stmt.setInt(1,idMedecin);

            ResultSet rs =
                    stmt.executeQuery();

            while(rs.next()){

                DisponibiliteModel d =
                        new DisponibiliteModel();

                d.setId(rs.getInt("id"));
                d.setId_medecin(
                        rs.getInt("id_medecin")
                );

                d.setDate_disponibilite(
                        rs.getDate(
                                "date_disponibilite"
                        ).toString()
                );

                d.setHeure_debut(
                        rs.getTime(
                                "heure_debut"
                        ).toString()
                );

                d.setHeure_fin(
                        rs.getTime(
                                "heure_fin"
                        ).toString()
                );

                list.add(d);
            }

        } catch(Exception e){

            e.printStackTrace();
        }

        return list;
    }

    // UPDATE
    public boolean updateDisponibilite(
            DisponibiliteModel dispo
    ){

        String sql = """
            UPDATE disponibilites_medecin
            SET
                date_disponibilite=?,
                heure_debut=?,
                heure_fin=?
            WHERE id=?
        """;

        try(
                Connection con =
                        ConnectionDB.getConnection();

                PreparedStatement stmt =
                        con.prepareStatement(sql)
        ){

            stmt.setDate(
                    1,
                    Date.valueOf(
                            dispo.getDate_disponibilite()
                    )
            );

            stmt.setTime(
                    2,
                    Time.valueOf(
                            LocalTime.parse(
                                dispo.getHeure_debut()
                            )
                    )
            );

            stmt.setTime(
                    3,
                    Time.valueOf(
                            LocalTime.parse(
                                dispo.getHeure_fin()
                            )
                    )
            );

            stmt.setInt(
                    4,
                    dispo.getId()
            );

            return stmt.executeUpdate() > 0;

        } catch(Exception e){

            e.printStackTrace();
        }

        return false;
    }

    // DELETE
    public boolean deleteDisponibilite(
            int id
    ){

        String sql =
                "DELETE FROM disponibilites_medecin WHERE id=?";

        try(
                Connection con =
                        ConnectionDB.getConnection();

                PreparedStatement stmt =
                        con.prepareStatement(sql)
        ){

            stmt.setInt(1,id);

            return stmt.executeUpdate() > 0;

        } catch(Exception e){

            e.printStackTrace();
        }

        return false;
    }

    // =========================
// GET DISPONIBILITES PAR MEDECIN + DATE
// =========================
    public List<DisponibiliteModel> getDisponibilitesByMedecinAndDate(
            int idMedecin,
            String date
    ) {

        List<DisponibiliteModel> list = new ArrayList<>();

        String sql = """
        SELECT *
        FROM disponibilites_medecin
        WHERE id_medecin = ?
        AND date_disponibilite = ?
        ORDER BY heure_debut
    """;

        try (
                Connection con = ConnectionDB.getConnection();
                PreparedStatement stmt = con.prepareStatement(sql)
        ) {

            stmt.setInt(1, idMedecin);
            stmt.setDate(2, Date.valueOf(date));

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {

                DisponibiliteModel d = new DisponibiliteModel();

                d.setId(rs.getInt("id"));
                d.setId_medecin(rs.getInt("id_medecin"));
                d.setDate_disponibilite(rs.getDate("date_disponibilite").toString());
                d.setHeure_debut(rs.getTime("heure_debut").toString());
                d.setHeure_fin(rs.getTime("heure_fin").toString());

                list.add(d);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }
}