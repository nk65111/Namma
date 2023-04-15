package com.namma.api.services;

import com.namma.api.dto.RideDto;
import com.namma.api.exception.ResourceNotFoundException;

public interface RideService {
   public void addRide(RideDto rideDto) throws ResourceNotFoundException;
}
