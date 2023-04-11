package com.namma.api.dto;

import com.namma.api.enumeration.Gender;

import lombok.Data;

@Data
public class CustomerDto  extends AuthDto{
	private Long id;
	private Gender gender;
}
