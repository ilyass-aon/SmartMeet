package com.smartmeet.coreservice.controller;

import com.smartmeet.coreservice.model.Meeting;
import com.smartmeet.coreservice.model.User;
import com.smartmeet.coreservice.repository.MeetingRepository;
import com.smartmeet.coreservice.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.smartmeet.coreservice.model.User;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(origins = "*")
public class MeetingController {

    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;

    public MeetingController(MeetingRepository meetingRepository, UserRepository userRepository) {
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
    }

    // Créer une réunion
    @PostMapping("/create")
    public ResponseEntity<?> createMeeting(@RequestBody Map<String, Object> payload) {
        String title = (String) payload.get("title");


        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User host = (User) authentication.getPrincipal();

        String roomId = UUID.randomUUID().toString();

        Meeting meeting = new Meeting(title, host, roomId);
        meetingRepository.save(meeting);

        return ResponseEntity.ok(Map.of(
                "message", "Réunion créée avec succès",
                "roomId", roomId,
                "host", host.getUsername()
        ));
    }

    // Rejoindre / Vérifier une réunion
    @GetMapping("/{roomId}")
    public ResponseEntity<?> getMeetingInfo(@PathVariable String roomId) {
        return meetingRepository.findByRoomId(roomId)
                .map(meeting -> ResponseEntity.ok(Map.of(
                        "title", meeting.getTitle(),
                        "host", meeting.getHost().getUsername(),
                        "roomId", meeting.getRoomId()
                )))
                .orElse(ResponseEntity.status(404).body(Map.of("message", "Réunion introuvable")));
    }
}