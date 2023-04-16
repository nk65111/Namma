package com.namma.api.services;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.namma.api.dto.RideDto;
import com.namma.api.entity.Customer;
import com.namma.api.entity.Driver;
import com.namma.api.entity.Ride;
import com.namma.api.entity.RideLocation;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.repository.CustomerRepository;
import com.namma.api.repository.DriverRepository;
import com.namma.api.repository.RideLocationRepository;
import com.namma.api.repository.RideRepository;

@Service
public class RideServiceImpl implements RideService {
	
	@Autowired
	private CustomerRepository customerRepository;
	
	
	@Autowired
	private DriverRepository driverRepository;
	
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
	    
        ride.setPickupTimeFirst(LocalTime.of(rideDto.getPickUpFirstHour(), rideDto.getPickUpFirstMinute()));
        ride.setPickupTimeSecond(LocalTime.of(rideDto.getPickUpSecondHour(), rideDto.getPickUpSecondMinute()));
        ride.setIsReturn(rideDto.getIsReturn());
        ride.setDate(rideDto.getDate());
	    location.setRide(ride);
	    this.rideLocationRepository.save(location);
	    
		 
	}

	@Override
	public void updateRide(RideDto rideDto) throws ResourceNotFoundException {
		Optional<Customer> customerOptional= this.customerRepository.findById(rideDto.getUserId());
		Customer customer=customerOptional.orElseThrow(()->new ResourceNotFoundException("User is not found with id :"+rideDto.getUserId()));
		
		Optional<Ride> rideOptional=this.rideRepository.findByCustomerAndDateAndIsReturn(customer, rideDto.getDate(),rideDto.getIsReturn());
		if(rideOptional.isPresent()==false) {
			addRide(rideDto);
		}else {
		  Ride ride=rideOptional.get();
		  RideLocation location= ride.getLocation();
		  location.setPickUplatitude(rideDto.getPickUpLatitiude());
		  location.setPickUplongitude(rideDto.getPickUpLongitute());
		  location.setDroplatitude(rideDto.getDropLatitude());
		  location.setDroplongitude(rideDto.getDropLongitute());
		  ride.setPickupTimeFirst(LocalTime.of(rideDto.getPickUpFirstHour(), rideDto.getPickUpFirstMinute()));
	      ride.setPickupTimeSecond(LocalTime.of(rideDto.getPickUpSecondHour(), rideDto.getPickUpSecondMinute()));
	      location.setRide(ride);
	      this.rideLocationRepository.save(location);
		}
	}

	
	

	@Override
	public void deleteRide(String date,Long custId) throws ResourceNotFoundException {
		Optional<Customer> customerOptional= this.customerRepository.findById(custId);
		Customer customer=customerOptional.orElseThrow(()->new ResourceNotFoundException("User is not found with id :"+custId));
		
		Ride ride=this.rideRepository.findByCustomerAndDate(customer,date).orElseThrow(()->new ResourceNotFoundException("Ride is not found"));
	    RideLocation location= ride.getLocation();
	    this.rideLocationRepository.delete(location);
	    this.rideRepository.delete(ride);
	    
		
	}

	@Override
	public List<RideDto> getAllCompleteRideByUser(Long customerId, boolean isCompleted)
			throws ResourceNotFoundException {
		Optional<Customer> customerOptional= this.customerRepository.findById(customerId);
		Customer customer=customerOptional.orElseThrow(()->new ResourceNotFoundException("User is not found with id :"+customerId));
		
		List<Ride> rides= this.rideRepository.findByCustomerAndIsCompleted(customer, isCompleted);
		
		List<RideDto> rideDtos=new ArrayList<>();
		rides.forEach(ride -> {
			RideDto rideDto=new RideDto();
			rideDto.setDate(ride.getDate());
			rideDto.setPickUpFirstHour(ride.getPickupTimeFirst().getHour());
			rideDto.setPickUpFirstMinute(ride.getPickupTimeFirst().getMinute());
			rideDto.setPickUpSecondHour(ride.getPickupTimeSecond().getHour());
			rideDto.setPickUpSecondMinute(ride.getPickupTimeSecond().getMinute());
			RideLocation location= ride.getLocation();
			rideDto.setPickUpLatitiude(location.getPickUplatitude());
			rideDto.setPickUpLongitute(location.getPickUplongitude());
			rideDto.setDropLatitude(location.getDroplatitude());
			rideDto.setDropLongitute(location.getDroplongitude());
			rideDtos.add(rideDto);
		}
		);
		return rideDtos;
		
	}

	@Override
	public List<RideDto> getAllCompleteRideByDriver(Long driverId, boolean isCompleted)
			throws ResourceNotFoundException {
		Optional<Driver> driverOptional= this.driverRepository.findById(driverId);
		Driver driver=driverOptional.orElseThrow(()->new ResourceNotFoundException("Driver is not found with id :"+driverId));
		
		List<Ride> rides= this.rideRepository.findByDriverAndIsCompleted(driver, isCompleted);
		
		List<RideDto> rideDtos=new ArrayList<>();
		rides.forEach(ride -> {
			RideDto rideDto=new RideDto();
			rideDto.setDate(ride.getDate());
			rideDto.setPickUpFirstHour(ride.getPickupTimeFirst().getHour());
			rideDto.setPickUpFirstMinute(ride.getPickupTimeFirst().getMinute());
			rideDto.setPickUpSecondHour(ride.getPickupTimeSecond().getHour());
			rideDto.setPickUpSecondMinute(ride.getPickupTimeSecond().getMinute());
			RideLocation location= ride.getLocation();
			rideDto.setPickUpLatitiude(location.getPickUplatitude());
			rideDto.setPickUpLongitute(location.getPickUplongitude());
			rideDto.setDropLatitude(location.getDroplatitude());
			rideDto.setDropLongitute(location.getDroplongitude());
			rideDtos.add(rideDto);
		}
		);
		return rideDtos;
	}

}
