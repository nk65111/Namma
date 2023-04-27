package com.namma.api.config;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;

@Configuration
public class FirebaseConfig {
	
	//private static FirebaseApp firebaseApp;
	private static boolean firebaseInitialized = false;
	
	@PostConstruct
    private void init() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
        	GoogleCredentials googleCredentials = GoogleCredentials
                    .fromStream(new ClassPathResource("firebase-service-account.json").getInputStream());
            
            FirebaseOptions firebaseOptions = FirebaseOptions
                    .builder()
                    .setCredentials(googleCredentials)
                    .build();
            
            FirebaseApp.initializeApp(firebaseOptions, "raahi");
            firebaseInitialized = true;
        }
    }   
      
	 
    @Bean
    public FirebaseMessaging firebaseMessaging(){
        return FirebaseMessaging.getInstance(FirebaseApp.getInstance("raahi"));
    }   
}
