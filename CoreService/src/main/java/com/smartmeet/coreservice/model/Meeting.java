package com.smartmeet.coreservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "meetings")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    /* Ce roomId sera généré automatiquement (UUID) unique
     C'est ce code qu'on partagera. */
    @Column(nullable = false, unique = true)
    private String roomId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Plusieurs meetings peuvent appartenir à Un User
    @ManyToOne
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    public Meeting() {}

    public Meeting(String title, User host, String roomId) {
        this.title = title;
        this.host = host;
        this.roomId = roomId;
        this.createdAt = LocalDateTime.now();
    }
}