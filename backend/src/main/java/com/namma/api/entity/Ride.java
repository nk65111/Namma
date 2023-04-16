package com.namma.api.entity;

import java.time.LocalTime;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

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
	
	private String date;
	
	@Column(name = "pickup_time_first")
    @Basic(optional = false)
    private LocalTime pickupTimeFirst;
	
	@Column(name = "pickup_time_second")
    @Basic(optional = false)
    private LocalTime pickupTimeSecond;
	
	private Boolean isReturn;
	
	private Boolean isCompleted;
	
	
	@OneToOne(mappedBy = "ride")
	private RideLocation location;
	
	@ManyToOne
	@JoinColumn(name = "customer_id")
	private Customer customer;
	
	@ManyToOne
    @JoinColumn(name = "driver_id")
	private Driver driver;
	
	private Long pricePerKilometer;
	private Long totalPrice;
}
