package com.smartmeet.coreservice.controller;

import com.smartmeet.coreservice.model.User;
import com.smartmeet.coreservice.repository.UserRepository;
import com.smartmeet.coreservice.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // Import important
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // On injecte l'encodeur
    private final JwtUtils jwtUtils;

    // Injection par constructeur
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cet email est déjà utilisé."));
        }
        // Hachage du mot de passe
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Inscription réussie !",
                "userId", savedUser.getId()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String rawPassword = loginData.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            String token = jwtUtils.generateToken(user.getUsername());

            return ResponseEntity.ok(Map.of(
                    "message", "Connexion réussie",
                    "token", token, // On renvoie le token au frontend
                    "username", user.getUsername()
            ));
            }

        return ResponseEntity.status(401).body(Map.of("message", "Email ou mot de passe incorrect"));
    }
}