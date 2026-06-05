package org.example.Services;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.Properties;

public class EmailService {

    private static final Dotenv dotenv = Dotenv
            .configure()
            .directory("/")
            .filename(".env")
            .load();
    private static final String EMAIL = dotenv.get("EMAIL");
    private static final String MDP_APP_EMAIL = dotenv.get("MDP_APP_EMAIL");
    private final String username =
            "votre_email@gmail.com";

    private final String password =
            "mot_de_passe_application";

    public void sendMail(
            String to,
            String subject,
            String content
    ) throws Exception {

        Properties props =
                new Properties();

        props.put(
                "mail.smtp.auth",
                "true"
        );

        props.put(
                "mail.smtp.starttls.enable",
                "true"
        );

        props.put(
                "mail.smtp.host",
                "smtp.gmail.com"
        );

        props.put(
                "mail.smtp.port",
                "587"
        );

        Session session =
                Session.getInstance(
                        props,
                        new Authenticator() {
                            @Override
                            protected PasswordAuthentication getPasswordAuthentication() {
                                return new PasswordAuthentication(
                                        EMAIL,
                                        MDP_APP_EMAIL
                                );
                            }
                        }
                );

        Message message =
                new MimeMessage(session);

        message.setFrom(
                new InternetAddress(
                        username
                )
        );

        message.setRecipients(
                Message.RecipientType.TO,
                InternetAddress.parse(to)
        );

        message.setSubject(subject);

        message.setText(content);

        Transport.send(message);
    }
}