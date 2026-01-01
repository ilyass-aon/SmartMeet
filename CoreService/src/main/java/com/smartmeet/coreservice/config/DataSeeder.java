package com.smartmeet.coreservice.config;

import com.smartmeet.coreservice.model.User;
import com.smartmeet.coreservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // On verifie si la base est vide
        if (userRepository.count() == 0) {
            System.out.println(" Base de données vide. Insertion d'un utilisateur de test...");

            User testUser = new User("admin", "admin@smartmeet.com", passwordEncoder.encode("password123"));

            userRepository.save(testUser);

            System.out.println(" Utilisateur de test créé avec succès ! ID: " + testUser.getId());
        } else {
            System.out.println("ℹ La base de données contient déjà des utilisateurs.");
        }
    }
}