package com.namma.api.services;

import java.util.List;

import com.namma.api.dto.CustomerDto;
import com.namma.api.dto.DriverDto;
import com.namma.api.dto.DriverKycDto;
import com.namma.api.dto.DriverLocationDto;
import com.namma.api.exception.OtpNotValidException;
import com.namma.api.exception.PhoneNumberNotFoundException;
import com.namma.api.exception.ResourceNotFoundException;

public interface DriverService {
	public String generateOtp(String phoneNumber);
	public void verifyOtp(String phoneNumber, String otp,  String deviceToken) throws OtpNotValidException, PhoneNumberNotFoundException;
	
	public void registerDriverKyc(DriverKycDto driverKycDto) throws ResourceNotFoundException;
	public DriverKycDto getDriverKycDetails(long driverId) throws ResourceNotFoundException;
	//public DriverDto updateProfile(DriverDto driverDto) throws PhoneNumberNotFoundException;
	
	public List<DriverDto> getAllDriver();
	public DriverDto getProfile(Long driverId) throws ResourceNotFoundException;
	public void updateProfile(DriverDto driverDto) throws ResourceNotFoundException;
	public void deleteProfile(Long driverId) throws ResourceNotFoundException;
	
	public void updateDriverLocation(DriverLocationDto driverLocationDto) throws ResourceNotFoundException;
	
}
  