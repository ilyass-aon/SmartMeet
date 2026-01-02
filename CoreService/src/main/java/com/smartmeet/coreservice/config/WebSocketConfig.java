package com.smartmeet.coreservice.config;

import com.smartmeet.coreservice.handler.SocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket // Active le support WebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final SocketHandler socketHandler;
    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;

    public WebSocketConfig(SocketHandler socketHandler, JwtHandshakeInterceptor jwtHandshakeInterceptor) {
        this.socketHandler = socketHandler;
        this.jwtHandshakeInterceptor = jwtHandshakeInterceptor;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(socketHandler, "/signal") // Point d'entrée : ws://localhost:8080/signal
                .addInterceptors(jwtHandshakeInterceptor)
                .setAllowedOrigins("*"); // Autorise Front à se connecter
    }
}