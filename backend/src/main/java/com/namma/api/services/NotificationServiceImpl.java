package com.namma.api.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.firebase.messaging.AndroidConfig;
import com.google.firebase.messaging.AndroidNotification;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.namma.api.dto.NotificationDto;

@Service
public class NotificationServiceImpl implements NotificationService {
	
	@Autowired
	private FirebaseMessaging firebaseMessaging;
	
	private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);
	
	public void sendNotification(NotificationDto note) throws FirebaseMessagingException {
		
		Notification notification = Notification
                .builder()
                .setTitle(note.getTitle())
                .setBody(note.getMessage())
                .build();
		
		Message message = Message
				.builder()
	            .putData("rideId", note.getRideId().toString())
				.setNotification(notification)
	            .setToken(note.getToken())
//	            .setAndroidConfig(AndroidConfig.builder()
//	                    .setNotification(AndroidNotification.builder()
//	                            .setClickAction("RIDE_DETAILS") // specifies the action to take when the notification is clicked
//	                            .build())
//	                    .build())
	            .build();
		
	    try {
	        String response = firebaseMessaging.getInstance().send(message);
	        logger.info("Successfully sent message: {}", response);
	    } catch (FirebaseMessagingException e) {
	        logger.error("Failed to send message: {}", e.getMessage());
	    }
    }

}


//write this thing in androidMenifest
//<intent-filter>
//<action android:name="RIDE_DETAILS" />
//<category android:name="android.intent.category.DEFAULT" />
//</intent-filter>
