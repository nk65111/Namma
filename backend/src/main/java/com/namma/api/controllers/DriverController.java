package com.namma.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.namma.api.dto.DriverKycDto;

@RestController
@RequestMapping("/api/v1/driver")
public class Driver {

    @PostMapping("/auth/kyc")
    public ResponseEntity<String> registerDriver(@RequestBody DriverKycDto driverKyc) {
        return ResponseEntity.ok("Driver registered successfully!");
    }

    @PostMapping("/auth/request-otp")
    public ResponseEntity<String> requestOtp(@RequestBody String driverPhoneNumber) {
        return ResponseEntity.ok("OTP sent successfully!");
    }
}
