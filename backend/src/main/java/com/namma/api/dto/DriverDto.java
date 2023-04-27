package com.namma.api.dto;

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
public class DriverDto extends AuthDto {
	private Long id;
	private Integer age;
	private KycStatus kycStatus;
	private KycStep onboardingStep;
	private Long walletId;
}
