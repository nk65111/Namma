package com.namma.api.services;

import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.namma.api.dto.AuthDto;
import com.namma.api.entity.Auth;
import com.namma.api.exception.OtpNotValidException;
import com.namma.api.exception.PhoneNumberNotFoundException;
import com.namma.api.repository.AuthRepository;

@Service
@Transactional
public class AuthServiceImpl implements AuthService{
	
	@Autowired
	private AuthRepository authRepository;
	
	@Autowired
	private OtpService otpService;
	
	public void generateOtp(String phoneNumber) {
		Optional<Auth> existingAuth = authRepository.findByPhoneNumber(phoneNumber);
		String token = otpService.generateOtp();
		
		if(!existingAuth.isPresent()) {
			Auth auth = new Auth();
	    	auth.setPhoneNumber(phoneNumber);
	    	auth.setOtp(token);
	    	authRepository.save(auth);
		}else {
			Auth auth = existingAuth.get();
			auth.setOtp(token);
			authRepository.save(auth);
		}
	}
	
	public void verifyOtp(String phoneNumber, String otp) throws OtpNotValidException, PhoneNumberNotFoundException {
		// Find auth by phone number
        Optional<Auth> authOptional = authRepository.findByPhoneNumber(phoneNumber);
        
        if (!authOptional.isPresent()) {
            throw new PhoneNumberNotFoundException("Auth not found with phone number: " + phoneNumber);
        }

        Auth auth = authOptional.get();

        // Check if OTP is valid
        if (!otpService.isOtpValid(phoneNumber, otp)) {
            throw new OtpNotValidException("Invalid OTP for phone number: " + phoneNumber);
        }

        // Clear OTP and update driver record
        auth.setOtp(null);
        authRepository.save(auth);
	}
	
	public AuthDto getProfile(String phoneNumber) throws PhoneNumberNotFoundException {
		
		Optional<Auth> authOptional = authRepository.findByPhoneNumber(phoneNumber);
		Auth auth = authOptional.orElseThrow(() -> new PhoneNumberNotFoundException("Auth not found with phone number: "+phoneNumber + ""));
		
		AuthDto authDto=authtoAuthDto(auth);
		return authDto;
	}
	
	public AuthDto updateProfile(AuthDto authDto) throws PhoneNumberNotFoundException {
	    Optional<Auth> authOptional=authRepository.findByPhoneNumber(authDto.getPhoneNumber());
	    Auth auth =authOptional.orElseThrow(()->new PhoneNumberNotFoundException("Auth not found with phone number: "+authDto.getPhoneNumber()+""));
	    
	    auth.setAuthType(authDto.getAuthType());
	    auth.setGender(authDto.getGender());
	    auth.setId(authDto.getId());
	    auth.setKycStatus(authDto.getKycStatus());
	    auth.setOnboardingStep(authDto.getOnboardingStep());
	    auth.setUsername(authDto.getUsername());
	    
	    Auth updatedAuth=  this.authRepository.save(auth);
	    AuthDto updatedAuthDto=authtoAuthDto(updatedAuth);
	    return updatedAuthDto;
	    
	    
	}
	
	public Auth authDtoToAuth(AuthDto authDto) {
		Auth auth =new Auth();
		auth.setAuthType(authDto.getAuthType());
	    auth.setGender(authDto.getGender());
	    auth.setId(authDto.getId());
	    auth.setKycStatus(authDto.getKycStatus());
	    auth.setOnboardingStep(authDto.getOnboardingStep());
	    auth.setUsername(authDto.getUsername());
	    auth.setPhoneNumber(authDto.getPhoneNumber());
	    return auth;
	}
	
	
	public AuthDto authtoAuthDto(Auth auth) {
		AuthDto authDto = new AuthDto();
		authDto.setAuthType(auth.getAuthType());
		authDto.setGender(auth.getGender());
		authDto.setId(auth.getId());
		authDto.setKycStatus(auth.getKycStatus());
		authDto.setOnboardingStep(auth.getOnboardingStep());
		authDto.setPhoneNumber(auth.getPhoneNumber());
		authDto.setUsername(auth.getUsername());
		return authDto;
	}
}
