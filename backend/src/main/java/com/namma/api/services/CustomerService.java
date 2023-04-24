package com.namma.api.services;

import java.util.List;

import com.namma.api.dto.CustomerDto;
import com.namma.api.exception.OtpNotValidException;
import com.namma.api.exception.PhoneNumberNotFoundException;
import com.namma.api.exception.ResourceNotFoundException;

public interface CustomerService {
	public String generateOtp(String phoneNumber);
	public void verifyOtp(String phoneNumber, String otp) throws OtpNotValidException, PhoneNumberNotFoundException;
	public CustomerDto getProfile(Long customerId) throws ResourceNotFoundException;
	public void updateProfile(CustomerDto customerDto) throws ResourceNotFoundException;
	public void deleteProfile(Long customerId) throws ResourceNotFoundException;
	public List<CustomerDto> getAllCustomer();
}
  