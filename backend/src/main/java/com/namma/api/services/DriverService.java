package com.namma.api.services;

import com.namma.api.dto.DriverKyc;

public interface DriverService {
    public void registerDriver(DriverKyc driverKyc);

    public void requestOtp(String phoneNumber);
}
