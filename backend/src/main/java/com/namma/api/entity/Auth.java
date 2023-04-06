package com.namma.api.entity;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import com.namma.api.enumeration.AuthType;
import com.namma.api.enumeration.Gender;
import com.namma.api.enumeration.KycStatus;
import com.namma.api.enumeration.KycStep;

import lombok.Data;

@Entity
@Data
public class Auth {
	@Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long Id;
	
	@NotNull(message = "Phone number is required")
	private String phoneNumber;
	
	private String username;
	
	@Enumerated(EnumType.STRING)
	private Gender gender;
	
	@Enumerated(EnumType.STRING)
	private AuthType authType;
	
	@Enumerated(EnumType.STRING)
	private KycStatus kycStatus;
	
	@Enumerated(EnumType.STRING)
	private KycStep onboardingStep;
	
	private String otp;
}
