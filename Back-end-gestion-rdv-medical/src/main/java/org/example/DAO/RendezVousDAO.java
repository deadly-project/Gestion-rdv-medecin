package org.example.DAO;

import org.example.Models.RendezVousModel;
import org.example.configuration.ConnectionDB;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RendezVousDAO {

    // CREATE
    public boolean createRendezVous(
            RendezVousModel rdv
    ){

        String sql = """
            INSERT INTO rendez_vous(
                id_patient,
                id_medecin,
                date_rdv,
                heure_rdv,
                motif
            )
            VALUES(?,?,?,?,?)
        """;

        try(
                Connection con =
                        ConnectionDB.getConnection();

                PreparedStatement stmt =
                        con.prepareStatement(sql)
        ){

            stmt.setInt(
                    1,
                    rdv.getId_patient()
            );

            stmt.setInt(
                    2,
                    rdv.getId_medecin()
            );

            stmt.setDate(
                    3,
                    Date.valueOf(
                            rdv.getDate_rdv()
                    )
            );

            stmt.setTime(
                    4,
                    Time.valueOf(
                            rdv.getHeure_rdv()
                    )
            );

            stmt.setString(
                    5,
                    rdv.getMotif()
            );

            return stmt.executeUpdate() > 0;

        } catch(Exception e){

            e.printStackTrace();
        }

        return false;
    }

    // PATIENT LIST
    public List<RendezVousModel>
    getPatientRdv(
            int patientId
    ){

        List<RendezVousModel> list =
                new ArrayList<>();

        String sql =
                "SELECT * FROM rendez_vous WHERE id_patient=?";

        try(
                Connection con =
                        ConnectionDB.getConnection();

                PreparedStatement stmt =
                        con.prepareStatement(sql)
        ){

            stmt.setInt(1,patientId);

            ResultSet rs =
                    stmt.executeQuery();

            while(rs.next()){

                RendezVousModel r =
                        new RendezVousModel();

                r.setId(
                        rs.getInt("id")
                );

                r.setId_patient(
                        rs.getInt(
                                "id_patient"
                        )
                );

                r.setId_medecin(
                        rs.getInt(
                                "id_medecin"
                        )
                );

                r.setDate_rdv(
                        rs.getDate(
                                "date_rdv"
                        ).toString()
                );

                r.setHeure_rdv(
                        rs.getTime(
                                "heure_rdv"
                        ).toString()
                );

                r.setMotif(
                        rs.getString("motif")
                );

                r.setStatut(
                        rs.getString("statut")
                );

                list.add(r);
            }

        } catch(Exception e){

            e.printStackTrace();
        }

        return list;
    }

    // VALIDATE
    public boolean validateRdv(
            int id
    ){

        String sql = """
            UPDATE rendez_vous
            SET statut='validated'
            WHERE id=?
        """;

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

    // REFUSE
    public boolean refuseRdv(
            int id
    ){

        String sql = """
            UPDATE rendez_vous
            SET statut='refused'
            WHERE id=?
        """;

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
}