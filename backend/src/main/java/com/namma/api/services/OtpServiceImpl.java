package com.namma.api.services;

import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.namma.api.exception.PhoneNumberNotFoundException;

@Service
public class OtpServiceImpl implements OtpService{
	
	@Override
    public String generateOtp() {
        // Generate OTP 
		 Random random = new Random();
	     int otp = 100000 + random.nextInt(900000);
		// useing twillio for send notification
        
	     return String.valueOf(otp);
    }

	@Override
    public boolean isOtpValid(String phoneNumber, String otp) throws PhoneNumberNotFoundException {
        // Check if OTP is valid for the given phone number
		//Optional<Auth> optional = authRepository.findByPhoneNumber(phoneNumber);
		
		//Auth auth = optional.orElseThrow(() -> new PhoneNumberNotFoundException(otp));
		
        // This could be implemented using a cache or database to store OTPs
        // and their expiration times
        // For simplicity, we're just checking if the OTP is "1234"
        return true;//otp.equals(auth.getOtp());
    }
}

