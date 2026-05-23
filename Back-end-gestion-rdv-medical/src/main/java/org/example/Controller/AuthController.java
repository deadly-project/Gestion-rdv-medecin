package org.example.Controller;

import org.example.DAO.UserDAO;
import org.example.Models.UsersModel;
import org.example.configuration.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;

public class AuthController {

    private final UserDAO dao = new UserDAO();

    public String login(String username, String password) {

        UsersModel user = dao.login(username);

        if (user == null) {
            return null;
        }

        boolean check = BCrypt.checkpw(
                password,
                user.getPassword()
        );

        if (!check) {
            return null;
        }

        return JwtUtil.generateToken(
                user.getUsername(),   // 🔥 subject = username
                user.getRole(),
                user.getId()
        );
    }
}