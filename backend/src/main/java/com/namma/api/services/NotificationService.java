package com.namma.api.services;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.namma.api.dto.NotificationDto;

public interface NotificationService {
	public void sendNotification(NotificationDto notificationDto) throws FirebaseMessagingException;
}
