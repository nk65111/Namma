package com.namma.api.dto;

import java.time.LocalDateTime;
import java.util.Date;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverKycDto {
	private Long Id;

    @NotBlank(message = "Driving license number is required")
    @Size(max = 20, message = "Driving license number must be less than 20 characters")
    private String drivingLicenseNumber;

    @NotBlank(message = "Bank name is required")
    @Size(max = 50, message = "Bank name must be less than 50 characters")
    private String bankName;

    @NotBlank(message = "Bank account number is required")
    @Size(max = 20, message = "Bank account number must be less than 20 characters")
    private String bankAccountNumber;

    @NotBlank(message = "IFSC code is required")
    @Size(max = 11, message = "IFSC code must be 11 characters")
    private String ifscCode;

    @NotBlank(message = "Account holder name is required")
    @Size(max = 50, message = "Account holder name must be less than 50 characters")
    private String accountHolderName;

    @NotBlank(message = "Vehicle registration number is required")
    @Size(max = 20, message = "Vehicle registration number must be less than 20 characters")
    private String vehicleRegistrationNumber;

    @NotBlank(message = "Vehicle model is required")
    @Size(max = 50, message = "Vehicle model must be less than 50 characters")
    private String vehicleModel;
    
    private Long authId;
    
    @JsonIgnore
    private LocalDateTime kycSubmittedAt;

    @JsonIgnore
    private LocalDateTime kycApprovedAt;
    
    @JsonIgnore
    private MultipartFile selfieImage;
    
    private String selfieImageLink;
    
    @JsonIgnore
    private MultipartFile drivingLicenceImage;
    
    private String driverLicenceImageLink;
    
    @JsonIgnore
    private LocalDateTime createdAt;
    
    @JsonIgnore
    private LocalDateTime updatedAt;

    // getters and setters
}

