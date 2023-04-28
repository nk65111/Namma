package com.namma.api.config;


import java.time.Instant;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.google.maps.model.LatLng;
import com.namma.api.dto.NotificationDto;
import com.namma.api.entity.Auth;
import com.namma.api.entity.Driver;
import com.namma.api.entity.Ride;
import com.namma.api.enumeration.RideStatus;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.repository.DriverRepository;
import com.namma.api.repository.RideRepository;
import com.namma.api.services.GoogleMapsService;
import com.namma.api.services.NotificationService;

import net.bytebuddy.asm.Advice.This;

@Component
public class SheduleRide {
	

	public static Auth auth;
	
	
	@Autowired
	private NotificationService notificationService;
	
	@Autowired
	private RideRepository rideRepository;
	
	@Autowired
	private DriverRepository driverRepository;
	
	@Autowired
	private GoogleMapsService googleMapsService;
	
	@Scheduled(fixedDelay = 6000)
	public void sheduleTask() {	
		if(auth!=null) {
			System.out.println("Runnig....");
			LocalTime to=LocalTime.now();
	        LocalTime from=to.plusMinutes(30);
	        Instant dateInstant=Instant.now();
	        System.out.println(to+" "+from+" "+dateInstant);
	        List<Ride> rides=rideRepository.findRidesByDateAndTime(to, from,dateInstant,auth.getId());
	        System.out.println(rides.size());
	        if(rides!=null&&rides.size()!=0) {
	            findSuitableDriver(rides.get(0));
	        }
		}
	}
	
	@Transactional(readOnly = true)
	public void findSuitableDriver(Ride ride) {
		
	    List<Driver> drivers=this.driverRepository.findAll();
	    Boolean driverGet=false;
	    Driver assignDriver=null;
	    try {
		    	for(Driver driver:drivers) {
		    		if(googleMapsService.isDriverNearby(driver,ride)&&driver.getIsAvilable()&&driver.getActive()) {
		    			assignDriver=driver;
		    			List<Ride> rides=driver.getRides();
		    			boolean isBatchflag=false;
		    			if(rides.size()>0&&rides.size()<3&&batchRides(ride, rides.get(0))) {
		    			    rides.add(ride);
		    			    if(rides.size()==3) {
		    			    	driver.setIsAvilable(false);
		    			    }
		    			    isBatchflag=true;
		    			    driverGet=true;
		    			    
		    			    driver.getRides().add(ride);
				    		this.driverRepository.save(driver);
				    		ride.setStatus(RideStatus.SHEDULED);
				    		ride.setDriver(assignDriver);
				    		this.rideRepository.save(ride);
				    		
		    			    NotificationDto notificationDto = new NotificationDto();
				    		notificationDto.setTitle("New Booking");
				    		notificationDto.setMessage("you have assign a passanger");
				    		notificationDto.setToken(ride.getDriver().getDeviceToken());
				    		notificationDto.setRideId(ride.getId());
				    		this.notificationService.sendNotification(notificationDto);
				    		
				    		NotificationDto notificationDtoForUser = new NotificationDto();
				    		notificationDtoForUser.setTitle("Accept Booking");
				    		notificationDtoForUser.setMessage("you have assign a driver");
				    		notificationDtoForUser.setToken(ride.getCustomer().getDeviceToken());
				    		notificationDtoForUser.setRideId(ride.getId());
				    		this.notificationService.sendNotification(notificationDtoForUser);
		    			    
		    			}
		    			if(isBatchflag) {
		    			   break;
		    			}
		    		}
		    	}
		    	if(driverGet==false&&assignDriver!=null) {
		    		assignDriver.getRides().add(ride);
		    		this.driverRepository.save(assignDriver);
		    		ride.setStatus(RideStatus.SHEDULED);
		    		ride.setDriver(assignDriver);
		    		this.rideRepository.save(ride);
		    		
		    		NotificationDto notificationDto = new NotificationDto();
		    		notificationDto.setTitle("New Booking");
		    		notificationDto.setMessage("you have assign a new passaneger");
		    		notificationDto.setToken(ride.getDriver().getDeviceToken());
		    		notificationDto.setRideId(ride.getId());
		    		this.notificationService.sendNotification(notificationDto);
		    		
		    		NotificationDto notificationDtoForUser = new NotificationDto();
		    		notificationDtoForUser.setTitle("Accept Booking");
		    		notificationDtoForUser.setMessage("you have assign driver for upcoming ride");
		    		notificationDtoForUser.setToken(ride.getCustomer().getDeviceToken());
		    		notificationDtoForUser.setRideId(ride.getId());
		    		this.notificationService.sendNotification(notificationDtoForUser);
		    		
		    	}
		    	else if(assignDriver==null) {
		    		throw new ResourceNotFoundException("Driver is not available in your location");
		    	}
		    	
	    }catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	// Batching threshold in meters for considering rides as intersecting
    private static final double INTERSECTION_THRESHOLD_METERS = 500;

    // Batching threshold in seconds for considering rides as having matching pickup time
    private static final long TIME_THRESHOLD_MINUTES = 5;
    
    private static final double EARTH_RADIUS_KM=6371.0;
    
    
	
	
	 public boolean batchRides(Ride ride1,Ride ride2) {
            if (isRideIntersecting(ride1, ride2) && isRideMatchingTime(ride1, ride2)) {
                return true;
            }
            return false;
	    }
	 
	    
	    
	 // Method to check if two rides are intersecting
	    private boolean isRideIntersecting(Ride ride1, Ride ride2) {
	    	LatLng pickLatLng1=new LatLng(ride1.getLocation().getPickUplatitude(),ride1.getLocation().getPickUplongitude());
	    	LatLng dropLatLng1=new LatLng(ride1.getLocation().getDroplatitude(),ride1.getLocation().getDroplongitude());
	    	
	    	LatLng pickLatLng2=new LatLng(ride2.getLocation().getPickUplatitude(),ride2.getLocation().getPickUplongitude());
	    	LatLng dropLatLng2=new LatLng(ride2.getLocation().getDroplatitude(),ride2.getLocation().getDroplongitude());
	        double pickupDistance = getDistance(pickLatLng1, pickLatLng2);
	        double dropDistance = getDistance(dropLatLng1, dropLatLng2);

	        return pickupDistance <= INTERSECTION_THRESHOLD_METERS || dropDistance <= INTERSECTION_THRESHOLD_METERS;
	    }

	    // Method to check if two rides have matching pickup time
	    private boolean isRideMatchingTime(Ride ride1, Ride ride2) {
	    	
	    	long timeDifferenceMinutes = ChronoUnit.MINUTES.between(ride1.getPickupTimeFirst(), ride2.getPickupTimeFirst());
	        return timeDifferenceMinutes <= TIME_THRESHOLD_MINUTES;
	    }
	    
	    
	 // Method to calculate distance between two LatLng points using Haversine formula
	    private double getDistance(LatLng latLng1, LatLng latLng2) {
	        double lat1 = Math.toRadians(latLng1.lat);
	        double lon1 = Math.toRadians(latLng1.lng);
	        double lat2 = Math.toRadians(latLng2.lat);
	        double lon2 = Math.toRadians(latLng2.lng);

	        double dLon = lon2 - lon1;
	        double dLat = lat2 - lat1;

	        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	                Math.cos(lat1) * Math.cos(lat2) *
	                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
	        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	        return EARTH_RADIUS_KM * c * 1000; // Convert to meters
	    }

	 
  
}
