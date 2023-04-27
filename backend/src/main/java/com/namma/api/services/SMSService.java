package com.namma.api.services;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class SMSService {
	
	@Value("${twilio.account-sid}")
	private String TWILLO_SID;
	
	@Value("${twilio.auth-token}")
	private String TWILLO_AUTH;
	
	
	@Value("${twilio.phone-number}")
	private String TWILLIO_PHONE_NO;
	
	@PostConstruct
	private void setUp() {
		Twilio.init(TWILLO_SID, TWILLO_AUTH);
	}
	
	public void doSMS(String phoneNumber,String token) {
		Message message=Message.creator(
				new PhoneNumber("+91"+phoneNumber), 
				new PhoneNumber(TWILLIO_PHONE_NO), 
				" Dear customer, the one time (OTP) to for  Raahi Ride is "+token).create();
	}
	
	

}
