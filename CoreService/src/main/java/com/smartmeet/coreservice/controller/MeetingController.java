package com.smartmeet.coreservice.controller;

import com.smartmeet.coreservice.model.Meeting;
import com.smartmeet.coreservice.service.MeetingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(origins = "*") // Autorise le Frontend
public class MeetingController {

    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    // Créer une réunion
    @PostMapping("/create")
    public ResponseEntity<?> createMeeting(@RequestBody Map<String, String> payload, Authentication authentication) {
        String title = payload.get("title");

        // On récupère le username (email) depuis le Token JWT de façon sécurisée
        String username = authentication.getName();

        // appelle le service
        Meeting meeting = meetingService.createMeeting(title, username);

        // reponse
        return ResponseEntity.ok(Map.of(
                "message", "Réunion créée avec succès",
                "roomId", meeting.getRoomId(),
                "host", username
        ));
    }

    // Récupérer les infos d'une réunion
    @GetMapping("/{roomId}")
    public ResponseEntity<?> getMeetingInfo(@PathVariable String roomId) {
        try {
            Meeting meeting = meetingService.getMeeting(roomId);
            return ResponseEntity.ok(Map.of(
                    "roomId", meeting.getRoomId(),
                    "title", meeting.getTitle(),
                    "host", meeting.getHost().getUsername()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Réunion introuvable"));
        }
    }
}