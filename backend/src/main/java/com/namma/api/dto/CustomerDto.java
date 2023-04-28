package com.namma.api.dto;


import com.google.auto.value.AutoValue.Builder;
import com.namma.api.enumeration.Gender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDto  extends AuthDto{
	private Long id;
	private Gender gender;
	private String profileImage;
	private Long walletId;
}
