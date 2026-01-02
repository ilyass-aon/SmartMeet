package com.smartmeet.coreservice.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SocketHandler extends TextWebSocketHandler {

    // Stockage : RoomID -> Liste des Sessions connectées (Utilisateurs)
    private final Map<String, CopyOnWriteArrayList<WebSocketSession>> rooms = new ConcurrentHashMap<>();

    // pour lire le JSON
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        /* Quand un utilisateur se connecte au WebSocket, on ne fait rien pour l'instant.
         On attend qu'il envoie un message "join_room". */
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();

        // On convertit le message JSON en Map Java
        Map<String, String> data = objectMapper.readValue(payload, Map.class);

        String type = data.get("type");
        String roomId = data.get("roomId");

        if (roomId == null) return;

        // Un utilisateur rejoint une salle
        if ("join_room".equals(type)) {
            // Créer la salle si elle n'existe pas et add user
            rooms.computeIfAbsent(roomId, k -> new CopyOnWriteArrayList<>());
            rooms.get(roomId).add(session);
            System.out.println("Nouvel utilisateur dans la salle " + roomId + ". Total: " + rooms.get(roomId).size());
        }
        // Scénario 2 : Signalisation (Offer, Answer, IceCandidate)
        // On transmet le message à TOUS les autres utilisateurs de la salle
        else {
            broadcastMessage(roomId, session, payload);
        }
    }

    private void broadcastMessage(String roomId, WebSocketSession senderSession, String message) {
        if (rooms.containsKey(roomId)) {
            for (WebSocketSession session : rooms.get(roomId)) {
                // On n'envoie le message aux autres
                if (session.isOpen() && !session.getId().equals(senderSession.getId())) {
                    try {
                        session.sendMessage(new TextMessage(message));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Nettoyage quand quelqu'un quitte
        rooms.forEach((roomId, sessions) -> {
            if (sessions.remove(session)) {
                System.out.println("Utilisateur parti de la salle " + roomId);
            }
        });
    }
}