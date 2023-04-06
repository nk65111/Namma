package com.namma.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.namma.api.dto.AuthDto;
import com.namma.api.exception.OtpNotValidException;
import com.namma.api.exception.PhoneNumberNotFoundException;
import com.namma.api.services.AuthService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
	
	@Autowired
	private AuthService authService;
	
	@PostMapping("/generateOtp")
	public ResponseEntity<String> generateOtp(String phoneNumber) {
		authService.generateOtp(phoneNumber);
		return new ResponseEntity<String>("OTP generated successfully", HttpStatus.OK);
	}
	
	@PostMapping("/verifyOtp")
	public ResponseEntity<String> verifyOtp(String phoneNumber, String otp) throws OtpNotValidException, PhoneNumberNotFoundException{
		authService.verifyOtp(phoneNumber, otp);
		return new ResponseEntity<>("OTP verified successfully", HttpStatus.OK);
	}
	
	@GetMapping("/profile/{phoneNumber}")
	public ResponseEntity<AuthDto> profile(@PathVariable String phoneNumber) throws PhoneNumberNotFoundException{
		AuthDto auth = authService.getProfile(phoneNumber);
		return new ResponseEntity<>(auth, HttpStatus.OK); 
	}
	
	@PutMapping("/profile")
	public ResponseEntity<String> updateProfile(AuthDto authDto) throws PhoneNumberNotFoundException{
		authService.updateProfile(authDto);
		return new ResponseEntity<>("Profile updated successfully", HttpStatus.OK); 
	}
}
