package com.namma.api.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

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
public class DriverKyc { 
	@Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String drivingLicenseNumber;
    private String bankname;
    private String bankAccountNumber;
    private String ifscCode;
    private String accountHolderName;
    private String vehicleRegistrationNumber;
    private String vehicleModel;
    private String selfie;
    private String drivingLicenceImgae;
    private String kycSubmittedAt;
    private String kycApprovedAt;
    
    @OneToOne
    @JoinColumn(name = "auth_id")
    private Auth auth;
    
}
