package org.example.Models;

public class UsersModel {
    private int id;
    private String username;
    private String password;
    private String email;
    private String role;
    private String user_status;

    public UsersModel() {

    }

    public UsersModel(
            int id,
            String username,
            String password,
            String email,
            String role,
            String user_status
    ){
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.user_status = user_status;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
}
