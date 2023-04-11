package com.namma.api.entity;

import java.time.LocalDateTime;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.namma.api.enumeration.KycStatus;
import com.namma.api.enumeration.KycStep;

import lombok.Data;

@Entity
@Data
@PrimaryKeyJoinColumn(name="driverId")
public class Driver extends Auth {
	
	private Integer age;
	
	@Enumerated(EnumType.STRING)
	private KycStatus kycStatus; 
	
	@Enumerated(EnumType.STRING)
	private KycStep onboardingStep;
	
	@OneToOne(mappedBy = "driver")
	private DriverKyc driverKyc; 
	
	@CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
