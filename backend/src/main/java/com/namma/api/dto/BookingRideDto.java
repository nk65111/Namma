package com.namma.api.dto;


import java.time.LocalDateTime;

import org.springframework.data.util.Pair;

import com.namma.api.enumeration.BookingStatus;

import lombok.Data;

@Data
public class BookingRideDto {
	private Long id;
	private Pair<String, String> pickupLocation; 
	private Pair<String, String> dropLocation;
	private Float price_per_km;
	private Long totalPrice;
	//all dateTime list
	private Long customerId;
	private Long driverId;
	private BookingStatus bookingStatus;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
