package org.example.Models;

public class DisponibiliteModel {

    private int id;
    private int id_medecin;

    private String date_disponibilite;

    private String heure_debut;
    private String heure_fin;

    public DisponibiliteModel(){}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId_medecin() {
        return id_medecin;
    }

    public void setId_medecin(int id_medecin) {
        this.id_medecin = id_medecin;
    }

    public String getDate_disponibilite() {
        return date_disponibilite;
    }

    public void setDate_disponibilite(String date_disponibilite) {
        this.date_disponibilite = date_disponibilite;
    }

    public String getHeure_debut() {
        return heure_debut;
    }

    public void setHeure_debut(String heure_debut) {
        this.heure_debut = heure_debut;
    }

    public String getHeure_fin() {
        return heure_fin;
    }

    public void setHeure_fin(String heure_fin) {
        this.heure_fin = heure_fin;
    }
}