package com.smartmeet.coreservice.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${smartmeet.app.jwtSecret}")
    private String jwtSecret;
    // Injection du temps d'expiration depuis application.properties
    @Value("${smartmeet.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    private Key getSigningKey() {
        // On transforme la chaîne en tableau d'octets (UTF-8)
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Générer le Token
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // Récupérer le username depuis le Token
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }


    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            System.err.println("Signature JWT invalide : " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("Token JWT expiré : " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("Token JWT non supporté : " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("La chaîne claims JWT est vide : " + e.getMessage());
        }
        return false;
    }
}