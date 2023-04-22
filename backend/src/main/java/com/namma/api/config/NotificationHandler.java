package com.namma.api.config;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class NotificationHandler extends TextWebSocketHandler {

    private List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Do nothing, we only need this method to satisfy the requirements of TextWebSocketHandler
    }

    public void notifyDriver(String driverId, String message) throws IOException {
        for (WebSocketSession session : sessions) {
            if (session.getAttributes().get("driverId").equals(driverId)) {
                session.sendMessage(new TextMessage(message));
            }
        }
    }

    public void notifyUser(String userId, String message) throws IOException {
        for (WebSocketSession session : sessions) {
            if (session.getAttributes().get("userId").equals(userId)) {
                session.sendMessage(new TextMessage(message));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
    }
}

