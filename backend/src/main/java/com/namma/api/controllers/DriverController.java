package com.namma.api.controllers;

import java.security.Principal;
import java.util.HashMap;
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
import org.springframework.web.bind.annotation.*;
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
import com.namma.api.dto.RideResponse;
import com.namma.api.entity.Auth;
import com.namma.api.entity.Driver;
import com.namma.api.exception.PhoneNumberNotFoundException;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.security.CustomUserDetails;
import com.namma.api.services.AbstractUserDetailsService;
import com.namma.api.services.DriverService;
import com.namma.api.services.RideService;
import com.namma.api.services.SMSService;

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
    private SMSService smsService;

    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/generateOtp")
	public ResponseEntity<String> generateOtp(@RequestParam("phoneNumber") String phoneNumber) {
    	System.out.print("phoneNumber: " +phoneNumber);
    	String otp= driverService.generateOtp(phoneNumber);
    	this.smsService.doSMS(phoneNumber, otp);
		return new ResponseEntity<String>("OTP generated successfully", HttpStatus.OK);
	}
	
    @PostMapping("/verifyOtp")
    public ResponseEntity<?> genrateToken(@RequestBody JwtRequest jwtRequest) throws Exception {
    	System.out.println(jwtRequest.getPhoneNumber()+" "+jwtRequest.getOtp());
        try {
           authentication(jwtRequest.getPhoneNumber(),jwtRequest.getOtp());
        }catch (UsernameNotFoundException e){
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }

        UserDetails userDetails= abstractUserDetailsService.loadUserByUsername(jwtRequest.getPhoneNumber());
        String token =this.jwtUtil.generateToken(userDetails);
        CustomUserDetails customUserDetails= (CustomUserDetails)userDetails;
        Auth auth=customUserDetails.getAuth();
        Driver driver=(Driver)auth;
        driver.setWalletId(driver.getWallet().getId());
        driver.setKycId(driver.getDriverKyc().getId());
        return  ResponseEntity.ok(new JwtResponse(token,driver));
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

    
    
//    @PostMapping("/kyc")
//    public ResponseEntity<String> kyc(@RequestParam(required = false,value = "kycData") String  kycData,
//    		@RequestParam(required = false,value =  "drivingLicenceImage") MultipartFile drivingLicenceImage,
//    		@RequestParam(required = false,value = "selfieImage") MultipartFile selfieImage, Principal principal) 
//    				throws JsonMappingException, JsonProcessingException, ResourceNotFoundException {
//    	
//    	DriverKycDto driverKycDto=mapper.readValue(kycData, DriverKycDto.class);
//    	Auth auth=getAuthByJwt(principal);
//    	driverKycDto.setAuthId(auth.getId());
//    	driverKycDto.setDrivingLicenceImage(drivingLicenceImage);
//    	driverKycDto.setSelfieImage(selfieImage);
//    	driverService.registerDriverKyc(driverKycDto);
//        
//        return new ResponseEntity<String>("Driver KYC details saved successfully", HttpStatus.CREATED);
//    }
    
    @PutMapping("/upload-licence")
    public ResponseEntity<DriverDto> uploadLicence(@RequestParam(required = false,value =  "drivingLicenceImage") MultipartFile drivingLicenceImage
    		,Principal principal) throws ResourceNotFoundException{
    	
    	Auth auth=getAuthByJwt(principal);
    	DriverDto url=this.driverService.uploadLicence(drivingLicenceImage, auth.getId());
    	return new ResponseEntity<DriverDto>(url,HttpStatus.OK);
    	
    }
    
    @PutMapping("/upload-selfie")
    public ResponseEntity<DriverDto> uploadSelfie(@RequestParam(required = false,value =  "selfie") MultipartFile selfie
    		,Principal principal) throws ResourceNotFoundException{
    	
    	Auth auth=getAuthByJwt(principal);
    	DriverDto dto=this.driverService.uploadSelfie(selfie, auth.getId());
    	return new ResponseEntity<DriverDto>(dto,HttpStatus.OK);
    	
    }
    
    @PutMapping("/upload-bankdetails")
    public ResponseEntity<DriverDto> uploadBankDetails(@RequestBody DriverKycDto driverKycDto,Principal principal) throws ResourceNotFoundException{
    	Auth auth=getAuthByJwt(principal);
    	DriverDto dto = this.driverService.uploadBankDetails(driverKycDto, auth.getId());
    	return new ResponseEntity<DriverDto>(dto,HttpStatus.OK);
    }
    
    @PutMapping("/upload-vehicledetails")
    public ResponseEntity<DriverDto> uploadVehicleDetils(@RequestBody DriverKycDto driverKycDto,Principal principal) throws ResourceNotFoundException{
    	Auth auth=getAuthByJwt(principal);
    	DriverDto dto = this.driverService.uploadVehicleDetails(driverKycDto, auth.getId());
    	return new ResponseEntity<DriverDto>(dto,HttpStatus.OK);
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
    public ResponseEntity<List<RideResponse>> getAllRidesByDriver(Principal principal) throws ResourceNotFoundException{
    	Auth auth=getAuthByJwt(principal);
    	List<RideResponse> rideResponses= this.rideService.getAllRideByDriver(auth.getId());
    	return new ResponseEntity<List<RideResponse>>(rideResponses,HttpStatus.OK);
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
