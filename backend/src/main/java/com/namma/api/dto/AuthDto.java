package com.namma.api.dto;

import javax.validation.constraints.NotNull;

import com.namma.api.enumeration.AuthType;
import com.namma.api.enumeration.Gender;
import com.namma.api.enumeration.KycStatus;
import com.namma.api.enumeration.KycStep;

import lombok.Data;

@Data
public class AuthDto {
	private Long Id;
	
	@NotNull(message = "Phone number is required")
	private String phoneNumber;
	
	private String username;
	
	private Gender gender;
	
	private AuthType authType;
	
	private KycStatus kycStatus;
	
	private KycStep onboardingStep;
	
	private String otp;
}
