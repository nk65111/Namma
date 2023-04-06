package com.namma.api.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

@Entity
@Data
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
    private String kycSubmittedAt;
    private String kycApprovedAt;
}
