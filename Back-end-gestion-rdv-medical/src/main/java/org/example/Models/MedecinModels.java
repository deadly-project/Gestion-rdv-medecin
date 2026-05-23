package org.example.Models;

public class MedecinModels {
    int id_user;
    private String specialite;
    private String nom_med;
    private int taux_horaire;
    private String lieu;

    public MedecinModels(){

    }

    public MedecinModels(
            int id_user,
            String nom_med,
            String specialite,
            int taux_horaire,
            String lieu
    ){
        this.id_user = id_user;
        this.nom_med = nom_med;
        this.specialite = specialite;
        this.taux_horaire = taux_horaire;
        this.lieu = lieu;
    }

    public int getId_user()
    {
        return id_user;
    }

    public void setId_user(int id_user) {
        this.id_user = id_user;
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

    public String getLieu() {
        return lieu;
    }

    public void setLieu(String lieu) {
        this.lieu = lieu;
    }

    public int getTaux_horaire() {
        return taux_horaire;
    }

    public void setTaux_horaire(int taux_horaire) {
        this.taux_horaire = taux_horaire;
    }
}
