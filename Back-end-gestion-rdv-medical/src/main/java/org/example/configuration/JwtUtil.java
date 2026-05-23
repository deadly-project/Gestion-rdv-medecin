package org.example.configuration;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.util.Date;
import javax.crypto.SecretKey;

public class JwtUtil {

    private static final SecretKey key =
            Keys.secretKeyFor(SignatureAlgorithm.HS256);

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