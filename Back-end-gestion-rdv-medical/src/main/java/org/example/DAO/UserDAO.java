package org.example.DAO;

import org.example.Models.UsersModel;
import org.example.configuration.ConnectionDB;
import org.mindrot.jbcrypt.BCrypt;

import java.sql.*;
        import java.util.ArrayList;
import java.util.List;

public class UserDAO {

    // CREATE
    public int createUser(
            UsersModel user
    ) {

        String sql =
                "INSERT INTO users(username, password, email, role, user_status) " +
                        "VALUES (?, ?, ?, ?, ?)";

        try (

                Connection connection =
                        ConnectionDB.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(
                                sql,
                                Statement.RETURN_GENERATED_KEYS
                        )

        ) {

            String hashedPassword =
                    BCrypt.hashpw(
                            user.getPassword(),
                            BCrypt.gensalt()
                    );

            statement.setString(
                    1,
                    user.getUsername()
            );

            statement.setString(
                    2,
                    hashedPassword
            );

            statement.setString(
                    3,
                    user.getEmail()
            );

            statement.setString(
                    4,
                    user.getRole()
            );

            statement.setString(
                    5,
                    user.getUser_status()
            );

            statement.executeUpdate();

            ResultSet generatedKeys =
                    statement.getGeneratedKeys();

            if (generatedKeys.next()) {

                return generatedKeys.getInt(1);
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return -1;
    }

    // READ ALL
    public List<UsersModel> getAllUsers() {

        List<UsersModel> users =
                new ArrayList<>();

        String sql =
                "SELECT * FROM users";

        try (
                Connection connection =
                        ConnectionDB.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql);

                ResultSet result =
                        statement.executeQuery()
        ) {

            while (result.next()) {

                UsersModel user =
                        new UsersModel();

                user.setId(
                        result.getInt("id")
                );

                user.setUsername(
                        result.getString("username")
                );

                user.setPassword(
                        result.getString("password")
                );

                user.setEmail(
                        result.getString("email")
                );

                user.setRole(
                        result.getString("role")
                );

                user.setUser_status(
                        result.getString("user_status")
                );

                users.add(user);
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return users;
    }

    // READ BY ID
    public UsersModel getUserById(
            int id
    ) {

        String sql =
                "SELECT * FROM users WHERE id = ?";

        try (
                Connection connection =
                        ConnectionDB.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setInt(1, id);

            ResultSet result =
                    statement.executeQuery();

            if (result.next()) {

                UsersModel user =
                        new UsersModel();

                user.setId(
                        result.getInt("id")
                );


                user.setUsername(
                        result.getString("username")
                );

                user.setPassword(
                        result.getString("password")
                );

                user.setEmail(
                        result.getString("email")
                );

                user.setRole(
                        result.getString("role")
                );

                user.setUser_status(
                        result.getString("user_status")
                );

                return user;
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return null;
    }

    // UPDATE
    public void updateUser(
            UsersModel user
    ) {

        String sql =
                "UPDATE users " +
                        "SET username=?, password=?, email=?, role=?, user_status=? " +
                        "WHERE id=?";

        try (
                Connection connection =
                        ConnectionDB.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            String hashedPassword =
                    BCrypt.hashpw(
                            user.getPassword(),
                            BCrypt.gensalt()
                    );


            statement.setString(
                    1,
                    user.getUsername()
            );

            statement.setString(
                    2,
                    hashedPassword
            );

            statement.setString(
                    3,
                    user.getEmail()
            );

            statement.setString(
                    4,
                    user.getRole()
            );


            statement.setString(
                    5,
                    user.getUser_status()
            );

            statement.setInt(
                    6,
                    user.getId()
            );

            statement.executeUpdate();

        } catch (Exception e) {

            e.printStackTrace();
        }
    }

    // DELETE
    public void deleteUser(
            int id
    ) {

        String sql =
                "DELETE FROM users WHERE id=?";

        try (
                Connection connection =
                        ConnectionDB.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setInt(1, id);

            statement.executeUpdate();

        } catch (Exception e) {

            e.printStackTrace();
        }
    }

    // LOGIN
    public UsersModel login(String username) {

        String sql = "SELECT * FROM users WHERE username=?";

        try (Connection conn = ConnectionDB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {

                UsersModel user = new UsersModel();

                user.setId(rs.getInt("id"));
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setPassword(rs.getString("password"));
                user.setRole(rs.getString("role"));

                return user;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}