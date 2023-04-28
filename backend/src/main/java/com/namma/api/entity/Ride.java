package com.namma.api.entity;

import java.time.Instant;
import java.time.LocalTime;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.namma.api.enumeration.RideStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Entity
@Table(name = "rides")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ride {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
	
	private Instant date;
	
	@Column(name = "pickup_time_first")
    @Basic(optional = false)
    private LocalTime pickupTimeFirst;
	
	@Column(name = "pickup_time_second")
    @Basic(optional = false)
    private LocalTime pickupTimeSecond;
	
	@Enumerated(EnumType.STRING) 
	private RideStatus status;
	
	
	@OneToOne(mappedBy = "ride")
	private RideLocation location;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "customer_id")
	private Customer customer;
	
	@ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id")
	private Driver driver;
	
	private Double travelDistance;
	private LocalTime travelTime;
	
	private String metadata;
}
