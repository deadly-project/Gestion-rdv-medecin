package org.example.DAO;

import org.example.DTO.RendezVousMedecinDTO;
import org.example.DTO.RendezVousPatientDTO;
import org.example.Models.RendezVousModel;
import org.example.configuration.ConnectionDB;
import org.example.DTO.RendezVousNotification;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RendezVousDAO {

    // =========================
    // CREATE RDV (RESERVATION SLOT)
    // =========================
    public boolean createRendezVous(RendezVousModel rdv) {

        String sql = """
            INSERT INTO rendez_vous(
                id_patient,
                id_medecin,
                id_disponibilite,
                date_rdv,
                heure_debut,
                heure_fin,
                motif,
                statut
            )
            VALUES(?,?,?,?,?,?,?,'pending')
        """;

        try (
                Connection con = ConnectionDB.getConnection();
                PreparedStatement stmt = con.prepareStatement(sql)
        ) {

            stmt.setInt(1, rdv.getId_patient());
            stmt.setInt(2, rdv.getId_medecin());
            stmt.setInt(3, rdv.getId_disponibilite());

            stmt.setDate(4, Date.valueOf(rdv.getDate_rdv()));
            stmt.setTime(5, Time.valueOf(rdv.getHeure_debut()));
            stmt.setTime(6, Time.valueOf(rdv.getHeure_fin()));

            stmt.setString(7, rdv.getMotif());

            return stmt.executeUpdate() > 0;

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    // =========================
    // GET RDV PATIENT
    // =========================
    public List<RendezVousPatientDTO> getPatientRdv(int patientId) {

        List<RendezVousPatientDTO> list = new ArrayList<>();

        String sql = """
            SELECT
                rv.id,
                rv.date_rdv,
                rv.heure_debut,
                rv.heure_fin,
                rv.motif,
                rv.statut,
                                  
                m.nom_med,
                m.specialite,
                m.lieu,
                m.taux_horaire
                                  
                FROM rendez_vous rv
                                  
                INNER JOIN medecins m
                      ON rv.id_medecin = m.id_user
                                  
                WHERE rv.id_patient = ?
                                  
                ORDER BY rv.date_rdv DESC
        """;

        try (
                Connection con = ConnectionDB.getConnection();
                PreparedStatement stmt = con.prepareStatement(sql)
        ) {

            stmt.setInt(1, patientId);

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                RendezVousPatientDTO r =
                        new RendezVousPatientDTO();

                r.setId(rs.getInt("id"));

                r.setDate_rdv(
                        rs.getDate("date_rdv").toString()
                );

                r.setHeure_debut(
                        rs.getTime("heure_debut").toString()
                );

                r.setHeure_fin(
                        rs.getTime("heure_fin").toString()
                );

                r.setMotif(
                        rs.getString("motif")
                );

                r.setStatut(
                        rs.getString("statut")
                );

                r.setNom_medecin(
                        rs.getString("nom_med")
                );

                r.setSpecialite(
                        rs.getString("specialite")
                );

                r.setLieu(
                        rs.getString("lieu")
                );

                r.setTaux_horaire(
                        rs.getInt("taux_horaire")
                );

                list.add(r);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

    // =========================
    // VALIDATE RDV
    // =========================
    public boolean validateRdv(int id) {

        String sql = """
            UPDATE rendez_vous
            SET statut='validated'
            WHERE id=?
        """;

        try (
                Connection con = ConnectionDB.getConnection();
                PreparedStatement stmt = con.prepareStatement(sql)
        ) {

            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    // =========================
    // REFUSE RDV
    // =========================
    public boolean refuseRdv(int id) {

        String sql = """
            UPDATE rendez_vous
            SET statut='refused'
            WHERE id=?
        """;

        try (
                Connection con = ConnectionDB.getConnection();
                PreparedStatement stmt = con.prepareStatement(sql)
        ) {

            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    // =========================
    // CHECK SLOT DEJA PRIS
    // =========================
    public boolean slotExiste(int idMedecin, String date, String debut, String fin) {

        String sql = """
            SELECT COUNT(*) FROM rendez_vous
            WHERE id_medecin=?
            AND date_rdv=?
            AND heure_debut=?
            AND heure_fin=?
            AND statut IN ('pending','validated')
        """;

        try (
                Connection con = ConnectionDB.getConnection();
                PreparedStatement stmt = con.prepareStatement(sql)
        ) {

            stmt.setInt(1, idMedecin);
            stmt.setDate(2, Date.valueOf(date));
            stmt.setTime(3, Time.valueOf(debut));
            stmt.setTime(4, Time.valueOf(fin));

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return rs.getInt(1) > 0;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    // =========================
// GET RDV PAR MEDECIN + DATE
// =========================
        public List<RendezVousModel> getRdvByMedecinAndDate(
        int idMedecin,
        String date
    ) {

            List<RendezVousModel> list = new ArrayList<>();

            String sql = """
        SELECT *
        FROM rendez_vous
        WHERE id_medecin = ?
        AND date_rdv = ?
        AND statut IN ('pending','validated')
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

                    RendezVousModel r = new RendezVousModel();

                    r.setId(rs.getInt("id"));
                    r.setId_patient(rs.getInt("id_patient"));
                    r.setId_medecin(rs.getInt("id_medecin"));
                    r.setId_disponibilite(rs.getInt("id_disponibilite"));

                    r.setDate_rdv(rs.getDate("date_rdv").toString());
                    r.setHeure_debut(rs.getTime("heure_debut").toString());
                    r.setHeure_fin(rs.getTime("heure_fin").toString());

                    r.setMotif(rs.getString("motif"));
                    r.setStatut(rs.getString("statut"));

                    list.add(r);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }

            return list;
        }

    //ANNULATION DE RENDEZ-VOUS PAR LE PATIENTS
    public boolean cancelRdv(int id) {

        String sql = """
        UPDATE rendez_vous
        SET statut='cancelled'
        WHERE id=?
    """;

        try (
                Connection con = ConnectionDB.getConnection();
                PreparedStatement stmt = con.prepareStatement(sql)
        ) {

            stmt.setInt(1, id);

            return stmt.executeUpdate() > 0;

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    //MISE À JOUR PAR LE PATIENTS DU RENDEZ-VOUS
    public boolean updateRendezVous(
            RendezVousModel rdv
    ) {

        String sql = """
        UPDATE rendez_vous
        SET
            date_rdv=?,
            heure_debut=?,
            heure_fin=?,
            motif=?
        WHERE id=?
    """;

        try (
                Connection con = ConnectionDB.getConnection();
                PreparedStatement stmt = con.prepareStatement(sql)
        ) {

            stmt.setDate(
                    1,
                    Date.valueOf(
                            rdv.getDate_rdv()
                    )
            );

            stmt.setTime(
                    2,
                    Time.valueOf(
                            rdv.getHeure_debut()
                    )
            );

            stmt.setTime(
                    3,
                    Time.valueOf(
                            rdv.getHeure_fin()
                    )
            );

            stmt.setString(
                    4,
                    rdv.getMotif()
            );

            stmt.setInt(
                    5,
                    rdv.getId()
            );

            return stmt.executeUpdate() > 0;

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    public List<RendezVousMedecinDTO> getMedecinRdv(
            int medecinId
    ) {

        List<RendezVousMedecinDTO> list =
                new ArrayList<>();

        String sql = """
        SELECT
        rv.id,
        rv.date_rdv,
        rv.heure_debut,
        rv.heure_fin,
        rv.motif,
        rv.statut,
                            
        p.nom_pat,
        p.datenais
                            
        FROM rendez_vous rv
                            
        INNER JOIN patients p
            ON rv.id_patient = p.id_user
                            
        WHERE rv.id_medecin = ?
                            
        ORDER BY rv.date_rdv DESC,
                 rv.heure_debut ASC
    """;


        try (
                Connection con =
                        ConnectionDB.getConnection();

                PreparedStatement stmt =
                        con.prepareStatement(sql)
        ) {

            stmt.setInt(
                    1,
                    medecinId
            );

            ResultSet rs =
                    stmt.executeQuery();

            while (rs.next()) {

                RendezVousMedecinDTO r =
                        new RendezVousMedecinDTO();

                r.setId(
                        rs.getInt("id")
                );

                r.setDate_rdv(
                        rs.getDate("date_rdv").toString()
                );

                r.setHeure_debut(
                        rs.getTime("heure_debut").toString()
                );

                r.setHeure_fin(
                        rs.getTime("heure_fin").toString()
                );

                r.setMotif(
                        rs.getString("motif")
                );

                r.setStatut(
                        rs.getString("statut")
                );

                r.setNom_patient(
                        rs.getString("nom_pat")
                );

                r.setDate_naissance(
                        rs.getDate("datenais").toString()
                );

                list.add(r);
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return list;
    }

    public RendezVousNotification getNotificationData(
            int rdvId
    ) {

        String sql = """
        SELECT
            rv.id,
            u.email,
            p.nom_pat,
            m.nom_med,
            rv.date_rdv,
            rv.heure_debut,
            rv.heure_fin
        FROM rendez_vous rv
        JOIN patients p
            ON rv.id_patient = p.id_user
        JOIN users u
            ON p.id_user = u.id
        JOIN medecins m
            ON rv.id_medecin = m.id_user
        WHERE rv.id = ?
    """;

        try (
                Connection con =
                        ConnectionDB.getConnection();

                PreparedStatement stmt =
                        con.prepareStatement(sql)
        ) {

            stmt.setInt(1, rdvId);

            ResultSet rs =
                    stmt.executeQuery();

            if(rs.next()) {

                RendezVousNotification n =
                        new RendezVousNotification();

                n.setId(
                        rs.getInt("id")
                );

                n.setEmailPatient(
                        rs.getString("email")
                );

                n.setNomPatient(
                        rs.getString("nom_pat")
                );

                n.setNomMedecin(
                        rs.getString("nom_med")
                );

                n.setDateRdv(
                        rs.getDate("date_rdv").toString()
                );

                n.setHeureDebut(
                        rs.getTime("heure_debut").toString()
                );

                n.setHeureFin(
                        rs.getTime("heure_fin").toString()
                );

                return n;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}