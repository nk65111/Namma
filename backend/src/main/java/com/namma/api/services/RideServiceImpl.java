package com.namma.api.services;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.namma.api.dto.RideDto;
import com.namma.api.entity.Customer;

import com.namma.api.entity.Ride;
import com.namma.api.entity.RideLocation;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.repository.CustomerRepository;
import com.namma.api.repository.RideLocationRepository;
import com.namma.api.repository.RideRepository;

@Service
public class RideServiceImpl implements RideService {
	
	@Autowired
	private CustomerRepository customerRepository;
	
	@Autowired 
	private RideRepository rideRepository;
	
	@Autowired 
	private RideLocationRepository rideLocationRepository;

	@Override
	public void  addRide(RideDto rideDto) throws ResourceNotFoundException {
		
		Optional<Customer> customerOptional= this.customerRepository.findById(rideDto.getUserId());
		Customer customer=customerOptional.orElseThrow(()->new ResourceNotFoundException("User is not found with id :"+rideDto.getUserId()));
		
		//setting pickup location
		RideLocation location=new RideLocation();
	    location.setPickUplatitude(rideDto.getPickUpLatitiude());
	    location.setPickUplongitude(rideDto.getPickUpLongitute());
	    location.setDroplatitude(rideDto.getDropLatitude());
	    location.setDroplongitude(rideDto.getDropLongitute());
		
	    Ride ride=new Ride();
	    ride.setCustomer(customer);
	    ride.setIsCompleted(false);
	    ride.setLocation(location);
	    
	    
	    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
        ride.setPickUpTime(LocalDateTime.parse(rideDto.getPickUpTime(), formatter));
	    location.setRide(ride);
	    this.rideLocationRepository.save(location);
		 
	}

}
