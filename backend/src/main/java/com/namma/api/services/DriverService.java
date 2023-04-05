package com.namma.api.services;

import com.namma.api.dto.DriverKycDto;

public interface DriverService {
    public void registerDriver(DriverKycDto driverKyc);

    public void requestOtp(String phoneNumber);
}
