package com.namma.api.dto;

import javax.validation.constraints.NotNull;

import com.namma.api.enumeration.UserType;
import com.namma.api.enumeration.Gender;
import com.namma.api.enumeration.KycStatus;
import com.namma.api.enumeration.KycStep;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthDto {
	@NotNull(message = "Phone number is required")
	private String phoneNumber;
	
	private String name;
	private String otp;

	
	private String deviceToken;

}
