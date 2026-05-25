package org.example.configuration;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

public class JwtUtil {
    private static final Dotenv dotenv = Dotenv
            .configure()
            .directory("/")
            .filename(".env")
            .load();

    private static final String SECRET_KEY = dotenv.get("SECRET_KEY");

    private static final SecretKey key =
            Keys.hmacShaKeyFor(
                    SECRET_KEY.getBytes(StandardCharsets.UTF_8)
            );

    private static final long EXPIRATION =
            1000 * 60 * 60 * 24; // 24h

    public static String generateToken(
            String email,
            String role,
            int userId
    ) {

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .claim("userId", userId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key)
                .compact();
    }

    public static Claims parseToken(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}