package org.example.Models;

public class PatientsModels {
    private int id_user;
    private String nom_pat;
    private String datenais;

    public PatientsModels(){

    }

    public PatientsModels(
            int id_user,
            String nom_pat,
            String datenais
    ){
        this.id_user = id_user;
        this.nom_pat = nom_pat;
        this.datenais = datenais;
    }

    public int getId_user() {
        return id_user;
    }

    public void setId_user(int id_user) {
        this.id_user = id_user;
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
