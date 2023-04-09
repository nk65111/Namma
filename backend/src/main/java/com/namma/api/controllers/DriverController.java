package com.namma.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.namma.api.dto.DriverKycDto;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.services.DriverKycService;

@RestController
@RequestMapping("/api/v1/driver")
public class DriverController {
    
    @Autowired
    private DriverKycService driverKycService;
    
    @Autowired
    private ObjectMapper mapper;
    
    @PostMapping("/kyc")
    public ResponseEntity<String> kyc(@RequestParam("kycData") String  kycData,
    		@RequestParam("drivingLicenceImage") MultipartFile drivingLicenceImage,
    		@RequestParam("selfieImage") MultipartFile selfieImage) 
    				throws JsonMappingException, JsonProcessingException, ResourceNotFoundException {
    	
    	DriverKycDto driverKycDto=mapper.readValue(kycData, DriverKycDto.class);
    	driverKycDto.setDrivingLicenceImage(drivingLicenceImage);
    	driverKycDto.setSelfieImage(selfieImage);
        driverKycService.registerDriverKyc(driverKycDto);
        
        return new ResponseEntity<String>("Driver KYC details saved successfully", HttpStatus.CREATED);
    }
    
    @GetMapping("/kyc/{authId}")
    public ResponseEntity<DriverKycDto> getDriverKyc(@PathVariable("authId") Long authId) throws ResourceNotFoundException{
    	DriverKycDto driverKycDto= driverKycService.getDriverKycDetails(authId);
    	return new ResponseEntity<>(driverKycDto,HttpStatus.OK);
    }
}
