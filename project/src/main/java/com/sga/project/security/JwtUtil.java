package com.sga.project.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret:miClaveSecretaSuperSeguraParaJWT2024ConMasDeChar}")
    private String secretKey;

    @Value("${jwt.expiration:86400000}") // 24 horas por defecto
    private Long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // Generar token JWT
    public String generateToken(String email, String rol, Integer numDocumento) {
        return Jwts.builder()
                .subject(String.valueOf(numDocumento))
                .claim("email", email)
                .claim("rol", rol)
                .claim("numDocumento", numDocumento)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }
    
    // Versión para compatibilidad (usa solo email y rol)
    public String generateToken(String email, String rol) {
        return generateToken(email, rol, null);
    }

    // Extraer email del token
    public String extractEmail(String token) {
        return extractClaims(token).get("email", String.class);
    }
    
    // Extraer numDocumento del token
    public Integer extractNumDocumento(String token) {
        return extractClaims(token).get("numDocumento", Integer.class);
    }

    // Extraer rol del token
    public String extractRol(String token) {
        return extractClaims(token).get("rol", String.class);
    }

    // Validar token
    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // Verificar si el token está expirado
    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    // Extraer claims del token
    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
