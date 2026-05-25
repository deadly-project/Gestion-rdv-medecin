package org.example.configuration;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter("/*")
public class CorsFilter implements Filter {

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

        // ORIGIN
        res.setHeader(
                "Access-Control-Allow-Origin",
                "http://localhost:5173"
        );

        // HEADERS
        res.setHeader(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization"
        );

        // METHODS
        res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
        );

        // CREDENTIALS
        res.setHeader(
                "Access-Control-Allow-Credentials",
                "true"
        );

        // PREFLIGHT
        if (
                req.getMethod()
                        .equalsIgnoreCase("OPTIONS")
        ) {

            res.setStatus(
                    HttpServletResponse.SC_OK
            );

            return;
        }

        chain.doFilter(request, response);
    }
}