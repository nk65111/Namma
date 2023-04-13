package com.namma.api.dto;




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
public class RideDto {
	private Long id;
	private Long userId;
	private Double pickUpLatitiude;
	private Double pickUpLongitute;
	private Double dropLatitude;
	private Double dropLongitute;
	private String pickUpTime;
	private Boolean isCompleted;
}
