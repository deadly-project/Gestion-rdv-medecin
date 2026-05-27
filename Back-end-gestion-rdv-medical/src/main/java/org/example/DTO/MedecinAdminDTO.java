package org.example.DTO;

public class MedecinAdminDTO {

    // USERS
    private int id;
    private String username;
    private String email;
    private String role;
    private String user_status;

    // MEDECIN
    private String nom_med;
    private String specialite;
    private int taux_horaire;
    private String lieu;

    public MedecinAdminDTO() {}

    public MedecinAdminDTO(
            int id,
            String username,
            String email,
            String role,
            String user_status,
            String nom_med,
            String specialite,
            int taux_horaire,
            String lieu
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.user_status = user_status;
        this.nom_med = nom_med;
        this.specialite = specialite;
        this.taux_horaire = taux_horaire;
        this.lieu = lieu;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUser_status() {
        return user_status;
    }

    public void setUser_status(String user_status) {
        this.user_status = user_status;
    }

    public String getNom_med() {
        return nom_med;
    }

    public void setNom_med(String nom_med) {
        this.nom_med = nom_med;
    }

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public int getTaux_horaire() {
        return taux_horaire;
    }

    public void setTaux_horaire(int taux_horaire) {
        this.taux_horaire = taux_horaire;
    }

    public String getLieu() {
        return lieu;
    }

    public void setLieu(String lieu) {
        this.lieu = lieu;
    }
}