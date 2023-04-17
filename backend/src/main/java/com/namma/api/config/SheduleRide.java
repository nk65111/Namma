package com.namma.api.config;

import java.io.IOException;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.hibernate.engine.jdbc.batch.spi.Batch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.namma.api.entity.Customer;
import com.namma.api.entity.Driver;
import com.namma.api.entity.Ride;
import com.namma.api.repository.RideRepository;

@Component
public class SheduleRide {

	
	public static Customer customer=null;
	
	@Autowired
	private RideRepository rideRepository;
	
	@Autowired
	private NotificationHandler notificationHandler;
	
	@Scheduled(fixedDelay = 1000)
	public void sheduleTask() {
		
        if(customer!=null) {
        	
        	  LocalTime now=LocalTime.now();
	          LocalTime pickUpThreshold=now.plusMinutes(30);
	          List<Ride> rides=	this.rideRepository.findByIsCompletedAndPickupTimeFirstBetween(false,now,pickUpThreshold);
		        if(rides!=null&&rides.size()!=0) {
		          bookRide(rides);
		        }else {
		        	System.out.println("No Rides Present..");
		        }

          
        }
	}
	
	public void bookRide(List<Ride> rides) {
		
		//batch rides and assign to drivers according them
		
		//this is example
		Ride ride=rides.get(0);
		Customer customer=ride.getCustomer();
		
		Driver driver=findSuitableDriver(ride);
		
		//set ride price todo
		
		try {
			
			//update json data //todo
			notificationHandler.notifyDriver(driver.getId()+"", "You have to pickup this customer");
			
			notificationHandler.notifyUser(driver.getId()+"", "You have assigned this driver today");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public Driver findSuitableDriver(Ride ride) {
		
		//todo after google api
		return null;
	}
}
