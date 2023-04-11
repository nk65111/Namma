package com.namma.api.entity;

import java.time.LocalDateTime;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

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
    @JoinColumn(name = "id")
    private Driver driver;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
}
