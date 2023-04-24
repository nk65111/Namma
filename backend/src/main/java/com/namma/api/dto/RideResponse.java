package com.namma.api.dto;

import java.time.Instant;
import java.time.LocalTime;

import com.namma.api.enumeration.RideStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RideResponse {
	private Long id;
	private Long userId;
	private Double pickUpLatitiude;
	private Double pickUpLongitute;
	private Double dropLatitude;
	private Double dropLongitute;
	private Instant date;
	private LocalTime pickUpTime;
	private RideStatus status;
	private Double travelDistance;
	private LocalTime travelTime;
	private String metadata;
}
