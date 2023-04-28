package com.namma.api.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Transient;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.namma.api.enumeration.KycStatus;
import com.namma.api.enumeration.KycStep;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Driver extends Auth {
	
	
	private static final long serialVersionUID = 1L;

	private Integer age;
	
	@Enumerated(EnumType.STRING)
	private KycStatus kycStatus; 
	 
	@Enumerated(EnumType.STRING)
	private KycStep onboardingStep;
	
	@OneToOne(mappedBy = "driver")
	@JsonIgnore
	private DriverKyc driverKyc; 
	
	@OneToOne(mappedBy = "driver")
	private DriverLocation location;
	
	@CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    private Boolean active;
    
    private Boolean isAvilable;
    
    @OneToMany(mappedBy = "driver", fetch = FetchType.EAGER)
    private List<Ride> rides = new ArrayList<>();
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "wallet_id", referencedColumnName = "id")
    @JsonIgnore
    private Wallet wallet;
    
    @Transient
    private Long walletId;
    
    @Transient
    private Long kycId;
 
}
