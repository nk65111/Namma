package com.namma.api.config;

import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.namma.api.entity.Customer;
import com.namma.api.entity.Ride;
import com.namma.api.repository.RideRepository;

@Component
public class SheduleRide {

	
	public static Customer customer=null;
	
	@Autowired
	private RideRepository rideRepository;
	
	@Scheduled(fixedDelay = 1000)
	public void sheduleTask() {
		
        if(customer!=null) {
        	  //change method todo
	          List<Ride> rides=	this.rideRepository.findByCustomerAndIsCompletedOrderByDateAsc(customer, false);
	          if(rides!=null&&rides.size()!=0) {
	          Ride ride=rides.get(0);
	          
	          LocalTime time=  ride.getPickupTimeFirst();
	          LocalTime secheduleTime= time.minus(30,ChronoUnit.MINUTES);
	          
	          long delayMillis = ChronoUnit.MILLIS.between(LocalTime.now(), secheduleTime);
	          
	          new java.util.Timer().schedule(new java.util.TimerTask() {
	              @Override
	              public void run() {
	                  runTask();
	              }
	          }, delayMillis);
	          
	        }else {
	        	System.out.println("No Rides Present..");
	        }

          
        }
	}
	
	public void runTask() {
		System.out.println("Driver Assigned....");
	}
}
