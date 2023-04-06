package com.namma.api.services;

import com.namma.api.dto.AuthDto;
import com.namma.api.exception.OtpNotValidException;
import com.namma.api.exception.PhoneNumberNotFoundException;

public interface AuthService {
	public void generateOtp(String phoneNumber);
	public void verifyOtp(String phoneNumber, String otp) throws OtpNotValidException, PhoneNumberNotFoundException;
	public AuthDto getProfile() throws PhoneNumberNotFoundException;
	public void updateProfile(AuthDto authDto);
}
 