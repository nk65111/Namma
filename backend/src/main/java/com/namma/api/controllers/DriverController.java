package com.namma.api.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.event.PublicInvocationEvent;
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
import com.namma.api.dto.DriverDto;
import com.namma.api.dto.DriverKycDto;
import com.namma.api.dto.DriverLocationDto;
import com.namma.api.dto.JwtRequest;
import com.namma.api.dto.JwtResponse;
import com.namma.api.dto.RideDto;
import com.namma.api.entity.Auth;
import com.namma.api.exception.PhoneNumberNotFoundException;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.security.CustomUserDetails;
import com.namma.api.services.AbstractUserDetailsService;
import com.namma.api.services.DriverService;
import com.namma.api.services.RideService;

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
    private AbstractUserDetailsService abstractUserDetailsService;
    
    @Autowired
    private RideService rideService;

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

        UserDetails userDetails= abstractUserDetailsService.loadUserByUsername(jwtRequest.getPhoneNumber());
        String token =this.jwtUtil.generateToken(userDetails);
        return  ResponseEntity.ok(new JwtResponse(token));
    }



    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser(Principal principal) throws ResourceNotFoundException{
       Auth auth= getAuthByJwt(principal);
     DriverDto driverDto=  this.driverService.getProfile(auth.getId());
       return new ResponseEntity<>(driverDto,HttpStatus.OK);
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
    
    public Auth getAuthByJwt(Principal principal) {
    	CustomUserDetails userDetails= (CustomUserDetails)this.abstractUserDetailsService.loadUserByUsername(principal.getName());
    	return userDetails.getAuth();
    }

    
    
    @PostMapping("/kyc")
    public ResponseEntity<String> kyc(@RequestParam("kycData") String  kycData,
    		@RequestParam("drivingLicenceImage") MultipartFile drivingLicenceImage,
    		@RequestParam("selfieImage") MultipartFile selfieImage, Principal principal) 
    				throws JsonMappingException, JsonProcessingException, ResourceNotFoundException {
    	
    	DriverKycDto driverKycDto=mapper.readValue(kycData, DriverKycDto.class);
    	Auth auth=getAuthByJwt(principal);
    	driverKycDto.setAuthId(auth.getId());
    	driverKycDto.setDrivingLicenceImage(drivingLicenceImage);
    	driverKycDto.setSelfieImage(selfieImage);
    	driverService.registerDriverKyc(driverKycDto);
        
        return new ResponseEntity<String>("Driver KYC details saved successfully", HttpStatus.CREATED);
    }
    
    @GetMapping("/kyc")
    public ResponseEntity<DriverKycDto> getDriverKyc(Principal principal) throws ResourceNotFoundException{
    	Auth auth=getAuthByJwt(principal);
    	DriverKycDto driverKycDto= driverService.getDriverKycDetails(auth.getId());
    	return new ResponseEntity<>(driverKycDto,HttpStatus.OK);
    }
    
    @GetMapping("/drivers")
    public ResponseEntity<List<DriverDto>> getAllCustomer(){
    	List<DriverDto> driverDtos = driverService.getAllDriver();
    	return new ResponseEntity<List<DriverDto>>(driverDtos, HttpStatus.OK);
    }
    
    
    @PutMapping("/update-profile")
	public ResponseEntity<String> updateProfile(@RequestBody DriverDto driverDto,Principal principal) throws PhoneNumberNotFoundException, ResourceNotFoundException{
    	Auth auth=getAuthByJwt(principal);
    	driverDto.setId(auth.getId());
    	driverService.updateProfile(driverDto);
		return new ResponseEntity<>("Profile updated successfully", HttpStatus.OK); 
	}
    
    @GetMapping("ride/history-ride")
    public ResponseEntity<List<RideDto>> getAllCompleteRideByCutomer(@RequestParam("isCompleted") Boolean isCompleted,Principal principal) throws ResourceNotFoundException{
    	Auth auth=getAuthByJwt(principal);
    	List<RideDto> rideDtos= this.rideService.getAllCompleteRideByDriver(auth.getId(), isCompleted);
    	return new ResponseEntity<List<RideDto>>(rideDtos,HttpStatus.OK);
    }
    
    @DeleteMapping("/delete-profile")
    public ResponseEntity<String> deleteProfile(Principal principal) throws ResourceNotFoundException{
    	
    	Auth auth=getAuthByJwt(principal);
    	
    	driverService.deleteProfile(auth.getId());
    	return new ResponseEntity<String>("Profile updated successfully", HttpStatus.OK);
    }
    
    @PutMapping("/update-location")
    public ResponseEntity<String> updateDriverLocation(@RequestBody DriverLocationDto driverLocationDto,Principal principal) throws ResourceNotFoundException {
    	Auth auth=getAuthByJwt(principal);
        driverLocationDto.setDrivingId(auth.getId());
        System.out.println(driverLocationDto);
        this.driverService.updateDriverLocation(driverLocationDto);
        return new ResponseEntity<>("Location Updated Successfully",HttpStatus.OK);
    }
}
