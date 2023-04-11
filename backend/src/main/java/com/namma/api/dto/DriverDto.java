package com.namma.api.dto;

import com.namma.api.enumeration.KycStatus;
import com.namma.api.enumeration.KycStep;

import lombok.Data;

@Data
public class DriverDto extends AuthDto {
	private Long id;
	private Integer age;
	private KycStatus kycStatus;
	private KycStep onboardingStep;
}
