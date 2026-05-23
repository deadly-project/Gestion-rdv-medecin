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
    ) throws IOException, ServletException{
        HttpServletResponse res = (HttpServletResponse) response;
        HttpServletRequest req = (HttpServletRequest) request;

        //Authorisation de l'origine
        res.setHeader("Access-Control-Allow-Origin", "*");

        res.setHeader(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization"
        );

        //Methode authorisé
        res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
        );

        //Authorisation des crédentials
        res.setHeader(
                "Access-Control-Allow-Credentials",
                "true"
        );

        //Requête preflight OPTIONS
        if(req.getMethod().equalsIgnoreCase("OPTIONS")){
            res.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        chain.doFilter(request, response);
    }
}
