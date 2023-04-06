package com.namma.api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.namma.api.dto.DriverKycDto;
import com.namma.api.services.DriverKycService;

@RestController
@RequestMapping("/api/v1/driver")
public class DriverController {
    
    @Autowired
    private DriverKycService driverKycService;
    
    @PostMapping("/kyc")
    public ResponseEntity<String> kyc(@RequestBody DriverKycDto driverKycDto) {
        driverKycService.registerDriverKyc(driverKycDto);
        return new ResponseEntity<String>("Driver KYC details saved successfully", HttpStatus.OK);
    }
}
