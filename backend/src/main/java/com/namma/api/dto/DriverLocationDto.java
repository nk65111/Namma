package com.namma.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DriverLocationDto {
	
    private Long id;
	private Double latitude;
	private Double longitutde;
	private Long drivingId;
}
