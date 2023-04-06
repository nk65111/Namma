package com.namma.api.services;

import com.namma.api.dto.DriverKycDto;
import com.namma.api.entity.DriverKyc;
import com.namma.api.exception.DriverNotFoundException;
import com.namma.api.exception.ResourceNotFoundException;

public interface DriverKycService {
	public void registerDriverKyc(DriverKycDto driverKycDto);
	public DriverKycDto getDriverKycDetails(long driverId) throws ResourceNotFoundException;
}
