package com.namma.api.services;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import javax.swing.JList.DropLocation;

import org.springframework.aop.ThrowsAdvice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.maps.model.DistanceMatrix;
import com.namma.api.dto.RideDto;
import com.namma.api.dto.RideResponse;
import com.namma.api.entity.Customer;
import com.namma.api.entity.Driver;
import com.namma.api.entity.Ride;
import com.namma.api.entity.RideLocation;
import com.namma.api.enumeration.RideStatus;
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
	
	@Autowired
	private GoogleMapsService googleMapsService;

	@Override
	public void  addRide(RideDto rideDto) throws ResourceNotFoundException {
		
		Optional<Customer> customerOptional= this.customerRepository.findById(rideDto.getUserId());
		Customer customer=customerOptional.orElseThrow(()->new ResourceNotFoundException("User is not found with id :"+rideDto.getUserId()));
		
		DistanceMatrix resultDistanceMatrix= googleMapsService.getDistance(rideDto.getPickUpLatitiude(), rideDto.getPickUpLongitute(), rideDto.getDropLatitude(), rideDto.getDropLongitute());
	    Double distanceInKilometer=resultDistanceMatrix.rows[0].elements[0].distance.inMeters / 1000.0;
	    long timeInMinutes=resultDistanceMatrix.rows[0].elements[0].duration.inSeconds / 60;
	    LocalTime timeTaken=LocalTime.of((int)(timeInMinutes/60), (int)(timeInMinutes%60));

	    for(Instant dateInstant:rideDto.getDate()) {
	    	RideLocation location=new RideLocation();
		    location.setPickUplatitude(rideDto.getPickUpLatitiude());
		    location.setPickUplongitude(rideDto.getPickUpLongitute());
		    location.setDroplatitude(rideDto.getDropLatitude());
		    location.setDroplongitude(rideDto.getDropLongitute());
		    
	    	Ride ride=new Ride();
	 	    ride.setCustomer(customer);
	 	    ride.setStatus(RideStatus.PENDING);
	 	    ride.setLocation(location);
	 	    ride.setMetadata(rideDto.getMetadata());
	 	    ride.setPickupTimeFirst(rideDto.getPickUpTime());
		    ride.setPickupTimeSecond(rideDto.getPickUpTime().plusMinutes(30L));
	        ride.setDate(dateInstant);
	        ride.setTravelDistance(distanceInKilometer);
	        ride.setTravelTime(timeTaken);
		    location.setRide(ride);
		    this.rideLocationRepository.save(location);
	    }
		 
	}

	@Override
	public void updateRide(RideResponse rideResponse) throws ResourceNotFoundException {
		Optional<Customer> customerOptional= this.customerRepository.findById(rideResponse.getUserId());
		Customer customer=customerOptional.orElseThrow(()->new ResourceNotFoundException("User is not found with id :"+rideResponse.getUserId()));
		
		Optional<Ride> rideOptional=this.rideRepository.findById(rideResponse.getId());
		if(rideOptional.isPresent()==false) {
			throw new ResourceNotFoundException("Ride is not found with given Id: "+rideResponse.getId());
		}else {
		  Ride ride=rideOptional.get();
		  
		  DistanceMatrix resultDistanceMatrix= googleMapsService.getDistance(rideResponse.getPickUpLatitiude(), rideResponse.getPickUpLongitute(), 
				  rideResponse.getDropLatitude(), rideResponse.getDropLongitute());
		  Double distanceInKilometer=resultDistanceMatrix.rows[0].elements[0].distance.inMeters / 1000.0;
		  long timeInMinutes=resultDistanceMatrix.rows[0].elements[0].duration.inSeconds / 60;
		  LocalTime timeTaken=LocalTime.of((int)(timeInMinutes/60), (int)(timeInMinutes%60));
		  
		  RideLocation location= ride.getLocation();
		  location.setPickUplatitude(rideResponse.getPickUpLatitiude());
		  location.setPickUplongitude(rideResponse.getPickUpLongitute());
		  location.setDroplatitude(rideResponse.getDropLatitude());
		  location.setDroplongitude(rideResponse.getDropLongitute());
		  ride.setPickupTimeFirst(rideResponse.getPickUpTime());
		  ride.setMetadata(rideResponse.getMetadata());
		  ride.setTravelDistance(distanceInKilometer);
		  ride.setTravelTime(timeTaken);
		  ride.setPickupTimeSecond(rideResponse.getPickUpTime().plusMinutes(30L));
	      location.setRide(ride);
	      this.rideLocationRepository.save(location);
		}
	}

	
	

	@Override
	public void deleteRide(Long rideId,Long custId) throws ResourceNotFoundException {
		Optional<Customer> customerOptional= this.customerRepository.findById(custId);
		customerOptional.orElseThrow(()->new ResourceNotFoundException("User is not found with id :"+custId));
		
		Ride ride=this.rideRepository.findById(rideId).orElseThrow(()->new ResourceNotFoundException("Ride is not found"));
	    RideLocation location= ride.getLocation();
	    this.rideLocationRepository.delete(location);
	    this.rideRepository.delete(ride);
	    
		
	}

	@Override
	public HashMap<String,Object> getAllRideByUser(Long customerId)
			throws ResourceNotFoundException {
		Optional<Customer> customerOptional= this.customerRepository.findById(customerId);
		Customer customer=customerOptional.orElseThrow(()->new ResourceNotFoundException("User is not found with id :"+customerId));
		
		List<Ride> rides= this.rideRepository.findByCustomerOrderByDateAsc(customer);
		
		List<RideResponse> rideResponse=new ArrayList<>();
		rides.forEach(ride -> {
			RideResponse response=RideResponse.builder()
					.date(ride.getDate())
					.id(ride.getId())
					.pickUpTime(ride.getPickupTimeFirst())
					.userId(customerId)
					.status(ride.getStatus())
					.metadata(ride.getMetadata())
					.pickUpLatitiude(ride.getLocation().getPickUplatitude())
					.pickUpLongitute(ride.getLocation().getPickUplongitude())
					.dropLatitude(ride.getLocation().getDroplatitude())
					.travelDistance(ride.getTravelDistance())
					.travelTime(ride.getTravelTime())
					.dropLongitute(ride.getLocation().getDroplongitude()).build();
			rideResponse.add(response);
		}
		);
		HashMap<String, Object> map=new HashMap<>();
		map.put("rides", rideResponse);
		RideResponse upcomingRide= getUpcomingRide(customerId);
	    map.put("upcomingRide", upcomingRide);
	    return map;
		
	}

	@Override
	public List<RideResponse> getAllRideByDriver(Long driverId)
			throws ResourceNotFoundException {
		Optional<Driver> driverOptional= this.driverRepository.findById(driverId);
		Driver driver=driverOptional.orElseThrow(()->new ResourceNotFoundException("Driver is not found with id :"+driverId));
		
		List<Ride> rides= this.rideRepository.findByDriverOrderByDateDesc(driver);
		
		List<RideResponse> rideResponses=new ArrayList<>();
		rides.forEach(ride -> {
			
			RideResponse response=RideResponse.builder()
					.date(ride.getDate())
					.id(ride.getId())
					.pickUpTime(ride.getPickupTimeFirst())
					.userId(ride.getCustomer().getId())
					.status(ride.getStatus())
					.metadata(ride.getMetadata())
					.pickUpLatitiude(ride.getLocation().getPickUplatitude())
					.pickUpLongitute(ride.getLocation().getPickUplongitude())
					.dropLatitude(ride.getLocation().getDroplatitude())
					.travelDistance(ride.getTravelDistance())
					.travelTime(ride.getTravelTime())
					.dropLongitute(ride.getLocation().getDroplongitude()).build();
			rideResponses.add(response);
		}
		);
		return rideResponses;
	}
	
	private RideResponse getUpcomingRide(Long custId) {
		
	   Instant dateInstant=Instant.now();
	   System.out.println(dateInstant);
	   List<Ride> rides= this.rideRepository.findRidesByDateAndTimeWithCutomer(custId);
		List<Ride> rides2=this.rideRepository.findAll();
		 
       
       if(rides.size()!=0) {
	   Ride ride=rides.get(0);
	   RideResponse response=RideResponse.builder()
				.date(ride.getDate())
				.id(ride.getId())
				.pickUpTime(ride.getPickupTimeFirst())
				.userId(ride.getCustomer().getId())
				.status(ride.getStatus())
				.metadata(ride.getMetadata())
				.pickUpLatitiude(ride.getLocation().getPickUplatitude())
				.pickUpLongitute(ride.getLocation().getPickUplongitude())
				.dropLatitude(ride.getLocation().getDroplatitude())
				.travelDistance(ride.getTravelDistance())
				.travelTime(ride.getTravelTime())
				.dropLongitute(ride.getLocation().getDroplongitude()).build();
	         return response;
         }
         return new RideResponse();
	}

}
