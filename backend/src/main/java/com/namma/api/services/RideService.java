package com.namma.api.services;

import java.util.HashMap;
import java.util.List;

import com.namma.api.dto.RideDto;
import com.namma.api.dto.RideResponse;
import com.namma.api.exception.ResourceNotFoundException;

public interface RideService {
	
   public void addRide(RideDto rideDto) throws ResourceNotFoundException;
   
   public void updateRide(RideResponse rideResponse) throws ResourceNotFoundException;
   
   public HashMap<String, Object> getAllRideByUser(Long customerId) throws ResourceNotFoundException;
   
   public List<RideResponse> getAllRideByDriver(Long driverId) throws ResourceNotFoundException;

   void deleteRide(Long rideId,Long custId) throws ResourceNotFoundException;
   
}
