package com.smartmeet.coreservice.config;

import com.smartmeet.coreservice.security.JwtUtils;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtils jwtUtils;

    public JwtHandshakeInterceptor(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        // Récupérer l'URL et les paramètres
        URI uri = request.getURI();
        String query = uri.getQuery();

        // Extraire le token proprement
        if (query != null && query.contains("token=")) {
            String token = query.substring(query.indexOf("token=") + 6);

            // S'il y a d'autres paramètres apres on coupe
            if (token.contains("&")) {
                token = token.substring(0, token.indexOf("&"));
            }

            // Valider le token
            if (jwtUtils.validateToken(token)) {
                String username = jwtUtils.getUsernameFromToken(token);
                // On stocke le username dans la session WebSocket pour plus tard
                attributes.put("username", username);
                return true; // Connexion acceptée
            }
        }

        System.out.println("Tentative de connexion WebSocket rejetée : Token invalide ou absent.");
        return false; //  Connexion refusée
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // ....
    }
}