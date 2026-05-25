package org.example.configuration;

import io.jsonwebtoken.Claims;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;

import jakarta.servlet.annotation.WebFilter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter("/api/*")
public class JwtFilter implements Filter {

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain
    ) throws IOException, ServletException {

        HttpServletRequest req =
                (HttpServletRequest) request;

        HttpServletResponse res =
                (HttpServletResponse) response;
        if (req.getMethod().equalsIgnoreCase("OPTIONS")) {
            chain.doFilter(request, response);
            return;
        }
        System.out.println("JWT FILTER EXECUTED");
        System.out.println("METHOD = " + req.getMethod());
        System.out.println("AUTH = " + req.getHeader("Authorization"));
        // HEADER AUTHORIZATION
        String authHeader =
                req.getHeader("Authorization");

        // TOKEN MANQUANT
        if (
                authHeader == null ||
                        !authHeader.startsWith("Bearer ")
        ) {
            System.out.println("TOKEN MANQUANT");
            res.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            res.setContentType("application/json");

            res.getWriter().write("""
                    {
                        "success": false,
                        "message": "Token manquant"
                    }
                    """);

            return;
        }

        try {

            // EXTRACTION TOKEN
            String token =
                    authHeader.substring(7);
            System.out.println("TOKEN = " + token);

            // VERIFY TOKEN
            Claims claims =
                    JwtUtil.parseToken(token);
            System.out.println("TOKEN VALIDE");
            Integer userId =
                    ((Number) claims.get("userId"))
                            .intValue();
            // STOCKAGE USER DANS REQUEST
            req.setAttribute(
                    "userId",
                    userId
            );

            req.setAttribute(
                    "role",
                    claims.get("role")
            );
            req.setAttribute(
                    "username",
                    claims.getSubject()
            );

            // NEXT
            chain.doFilter(request, response);

        } catch (Exception e) {

            res.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            res.setContentType("application/json");

            res.getWriter().write("""
                    {
                        "success": false,
                        "message": "Token invalide"
                    }
                    """);
        }
    }
}