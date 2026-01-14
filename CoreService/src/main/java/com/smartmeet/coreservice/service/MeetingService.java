package com.smartmeet.coreservice.service;

import com.smartmeet.coreservice.model.Meeting;
import com.smartmeet.coreservice.model.User;
import com.smartmeet.coreservice.repository.MeetingRepository;
import com.smartmeet.coreservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;

    public MeetingService(MeetingRepository meetingRepository, UserRepository userRepository) {
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
    }

    public Meeting createMeeting(String title, String username) {
        // On cherche l'utilisateur proprement via son email/username
        User host = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable : " + username));

        // On prépare la réunion
        Meeting meeting = new Meeting();
        meeting.setTitle(title);
        meeting.setHost(host);
        meeting.setRoomId(UUID.randomUUID().toString()); // Génère l'ID unique (ex: 550e-8400...)

        // On sauvegarde
        return meetingRepository.save(meeting);
    }

    public Meeting getMeeting(String roomId) {
        return meetingRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Réunion introuvable"));
    }
}