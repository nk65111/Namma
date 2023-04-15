package com.namma.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.namma.api.dto.RideDto;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.services.RideService;

@RestController
@RequestMapping("/api/v1/ride")
public class BookingRide {
	
	
	
	
	
	@GetMapping("/all-ride")
	public ResponseEntity<String> getAllRide(){
		return new ResponseEntity<String>("get all ride successfully", HttpStatus.OK);
	}
	
	@GetMapping()
	public ResponseEntity<String> rideById(Long rideId){
		return new ResponseEntity<String>("get all ride successfully", HttpStatus.OK);
	}
	
	@PutMapping()
	public ResponseEntity<String> updateRide(Long rideId){
		return new ResponseEntity<String>("update ride successfully", HttpStatus.OK);
	}
	
	@DeleteMapping()
	public ResponseEntity<String> deleteRide(Long rideId){
		return new ResponseEntity<String>("delete ride successfully", HttpStatus.OK);
	}
}
