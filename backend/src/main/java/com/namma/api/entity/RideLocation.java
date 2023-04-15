package com.namma.api.entity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "locations")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RideLocation {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private Double pickUplatitude;
	private Double pickUplongitude;
	
	private Double droplatitude;
	private Double droplongitude;

	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "ride_id")
	private Ride ride;
	
	
}
