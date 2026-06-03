package org.example.Models;

public class SlotModel {

    private int id_disponibilite;
    private String heure_debut;
    private String heure_fin;

    public SlotModel() {
    }

    public SlotModel(
            int id_disponibilite,
            String heure_debut,
            String heure_fin
    ) {
        this.id_disponibilite = id_disponibilite;
        this.heure_debut = heure_debut;
        this.heure_fin = heure_fin;
    }

    public int getId_disponibilite() {
        return id_disponibilite;
    }

    public void setId_disponibilite(int id_disponibilite) {
        this.id_disponibilite = id_disponibilite;
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