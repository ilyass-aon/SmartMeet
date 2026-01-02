package com.smartmeet.coreservice.repository;

import com.smartmeet.coreservice.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    // Pour trouver une réunion quand l'invité clique sur un lien
    Optional<Meeting> findByRoomId(String roomId);
}