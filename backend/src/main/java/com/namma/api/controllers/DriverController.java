package com.namma.api.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.namma.api.config.JwtUtil;
import com.namma.api.dto.AuthDto;
import com.namma.api.dto.CustomerDto;
import com.namma.api.dto.DriverDto;
import com.namma.api.dto.DriverKycDto;
import com.namma.api.entity.Auth;
import com.namma.api.entity.JwtRequest;
import com.namma.api.entity.JwtResponse;
import com.namma.api.exception.PhoneNumberNotFoundException;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.services.DriverService;
import com.namma.api.services.UserDetailsServiceImpl;

@RestController
@RequestMapping("/api/v1/driver")
public class DriverController {
    
    @Autowired
    private DriverService driverService;
    
    @Autowired
    private ObjectMapper mapper;
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/generateOtp")
	public ResponseEntity<String> generateOtp(@RequestParam("phoneNumber") String phoneNumber) {
    	driverService.generateOtp(phoneNumber);
		return new ResponseEntity<String>("OTP generated successfully", HttpStatus.OK);
	}
	
    @PostMapping("/verifyOtp")
    public ResponseEntity<?> genrateToken(@RequestBody JwtRequest jwtRequest) throws Exception {
        try {
           authentication(jwtRequest.getPhoneNumber(),jwtRequest.getOtp());
        }catch (UsernameNotFoundException e){
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }

        UserDetails userDetails= this.userDetailsService.loadUserByUsername(jwtRequest.getPhoneNumber());
        String token =this.jwtUtil.generateToken(userDetails);
        return  ResponseEntity.ok(new JwtResponse(token));
    }



    @GetMapping("/current-user")
    public Auth getCurrentUser(Principal principal){
        return  (Auth)this.userDetailsService.loadUserByUsername(principal.getName());
    }
	
    public void authentication(String username,String password) throws Exception {
        try {
           authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,password));
        }catch (DisabledException e){
            throw  new Exception("User Disable "+e.getMessage());
        }catch (BadCredentialsException e){
             throw new Exception("Invalid usename and password ,"+e.getMessage());
        }catch (Exception e){
            throw  new Exception(e.getMessage());
        }
    }
    
    
    @PostMapping("/kyc")
    public ResponseEntity<String> kyc(@RequestParam("kycData") String  kycData,
    		@RequestParam("drivingLicenceImage") MultipartFile drivingLicenceImage,
    		@RequestParam("selfieImage") MultipartFile selfieImage) 
    				throws JsonMappingException, JsonProcessingException, ResourceNotFoundException {
    	
    	DriverKycDto driverKycDto=mapper.readValue(kycData, DriverKycDto.class);
    	driverKycDto.setDrivingLicenceImage(drivingLicenceImage);
    	driverKycDto.setSelfieImage(selfieImage);
    	driverService.registerDriverKyc(driverKycDto);
        
        return new ResponseEntity<String>("Driver KYC details saved successfully", HttpStatus.CREATED);
    }
    
    @GetMapping("/kyc/{authId}")
    public ResponseEntity<DriverKycDto> getDriverKyc(@PathVariable("authId") Long authId) throws ResourceNotFoundException{
    	DriverKycDto driverKycDto= driverService.getDriverKycDetails(authId);
    	return new ResponseEntity<>(driverKycDto,HttpStatus.OK);
    }
    
    @GetMapping("/drivers")
    public ResponseEntity<List<DriverDto>> getAllCustomer(){
    	List<DriverDto> driverDtos = driverService.getAllDriver();
    	return new ResponseEntity<List<DriverDto>>(driverDtos, HttpStatus.OK);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<DriverDto> getProfile(Long customerId) throws ResourceNotFoundException {
    	DriverDto driverDto = driverService.getProfile(customerId);
    	return new ResponseEntity<DriverDto>(driverDto, HttpStatus.OK);
    }
    
    @PutMapping("/update-profile")
	public ResponseEntity<String> updateProfile(DriverDto driverDto) throws PhoneNumberNotFoundException, ResourceNotFoundException{
    	driverService.updateProfile(driverDto);
		return new ResponseEntity<>("Profile updated successfully", HttpStatus.OK); 
	}
    
    @DeleteMapping("/delete-profile")
    public ResponseEntity<String> deleteProfile(Long driverId) throws ResourceNotFoundException{
    	driverService.deleteProfile(driverId);
    	return new ResponseEntity<String>("Profile updated successfully", HttpStatus.OK);
    }
}
