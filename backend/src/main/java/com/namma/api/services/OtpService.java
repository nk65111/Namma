package com.namma.api.services;

import com.namma.api.exception.PhoneNumberNotFoundException;

public interface OtpService {
	public String generateOtp();
	public boolean isOtpValid(String phoneNumber, String otp) throws PhoneNumberNotFoundException;
}
 