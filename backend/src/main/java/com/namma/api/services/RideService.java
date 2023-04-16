package com.namma.api.services;

import java.util.List;

import com.namma.api.dto.RideDto;
import com.namma.api.exception.ResourceNotFoundException;

public interface RideService {
	
   public void addRide(RideDto rideDto) throws ResourceNotFoundException;
   
   public void updateRide(RideDto rideDto) throws ResourceNotFoundException;
   
   public List<RideDto> getAllCompleteRideByUser(Long customerId,boolean isCompleted) throws ResourceNotFoundException;
   
   public List<RideDto> getAllCompleteRideByDriver(Long driverId,boolean isCompleted) throws ResourceNotFoundException;

   void deleteRide(String date,Long custId) throws ResourceNotFoundException;
   
}
