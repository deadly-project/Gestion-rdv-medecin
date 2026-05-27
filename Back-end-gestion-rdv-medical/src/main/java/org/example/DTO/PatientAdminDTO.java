package org.example.DTO;

public class PatientAdminDTO {

    // USERS
    private int id;
    private String username;
    private String email;
    private String role;
    private String user_status;

    // PATIENT
    private String nom_pat;
    private String datenais;

    public PatientAdminDTO() {}

    public PatientAdminDTO(
            int id,
            String username,
            String email,
            String role,
            String user_status,
            String nom_pat,
            String datenais
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.user_status = user_status;
        this.nom_pat = nom_pat;
        this.datenais = datenais;
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

    public String getNom_pat() {
        return nom_pat;
    }

    public void setNom_pat(String nom_pat) {
        this.nom_pat = nom_pat;
    }

    public String getDatenais() {
        return datenais;
    }

    public void setDatenais(String datenais) {
        this.datenais = datenais;
    }
}