package com.namma.api.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.namma.api.entity.Auth;
import com.namma.api.exception.PhoneNumberNotFoundException;
import com.namma.api.repository.AuthRepository;

@Service
public class OtpServiceImpl implements OtpService{
	
    @Autowired
    private AuthRepository authRepository;
	
	@Override
    public String generateOtp() {
        // Generate OTP 
		// useing twillio for send notification
        String otp = "";
        return otp;
    }

	@Override
    public boolean isOtpValid(String phoneNumber, String otp) throws PhoneNumberNotFoundException {
        // Check if OTP is valid for the given phone number
		Optional<Auth> optional = authRepository.findByPhoneNumber(phoneNumber);
		
		Auth auth = optional.orElseThrow(() -> new PhoneNumberNotFoundException(otp));
		
        // This could be implemented using a cache or database to store OTPs
        // and their expiration times
        // For simplicity, we're just checking if the OTP is "1234"
        return otp.equals(auth.getOtp());
    }
}

