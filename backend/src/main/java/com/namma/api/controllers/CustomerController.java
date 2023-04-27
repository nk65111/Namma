package com.namma.api.controllers;

import java.security.Principal;
import java.time.Instant;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.namma.api.config.JwtUtil;
import com.namma.api.config.SheduleRide;
import com.namma.api.dto.AuthDto;
import com.namma.api.dto.CustomerDto;
import com.namma.api.dto.JwtRequest;
import com.namma.api.dto.JwtResponse;
import com.namma.api.dto.RideDto;
import com.namma.api.dto.RideResponse;
import com.namma.api.entity.Auth;
import com.namma.api.entity.Customer;
import com.namma.api.entity.Ride;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.repository.RideRepository;
import com.namma.api.security.CustomUserDetails;
import com.namma.api.services.AbstractUserDetailsService;
import com.namma.api.services.AbstractUserDetailsServiceImpl;
import com.namma.api.services.CustomerService;
import com.namma.api.services.RideService;
import com.namma.api.services.SMSService;

import ch.qos.logback.core.pattern.color.CyanCompositeConverter;

@RestController
@RequestMapping("/api/v1/customer")
public class CustomerController {
	
	@Autowired
	private CustomerService customerService;
	
	@Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AbstractUserDetailsService abstractUserDetailsService ;
    
    @Autowired
    private AbstractUserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired 
    private SheduleRide sheduleRide;
    
    @Autowired
    private RideRepository rideRepository;
    
    @Autowired
    private SMSService smsService;
    
    
    @Autowired
	private RideService rideService;
	
	@PostMapping("/generateOtp")
	public ResponseEntity<String> generateOtp(@RequestParam("phoneNumber") String phoneNumber) {
		String otp= customerService.generateOtp(phoneNumber);
		this.smsService.doSMS(phoneNumber,otp);
		return new ResponseEntity<String>("OTP generated successfully", HttpStatus.OK);
	}
	
	@PostMapping("/ride/book")
	public ResponseEntity<String> bookride(@RequestBody RideDto rideDto,Principal principal) throws ResourceNotFoundException{
		Auth auth=getAuthByJwt(principal);
		rideDto.setUserId(auth.getId());
		this.rideService.addRide(rideDto);
		return new ResponseEntity<String>("Ride booked successfully", HttpStatus.CREATED);
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
        CustomUserDetails customUserDetails= (CustomUserDetails)userDetails;
        Auth auth=customUserDetails.getAuth();
        this.sheduleRide.auth=auth;
        Customer customer=(Customer)auth;
        customer.setWalletId(customer.getWallet().getId());
        return  ResponseEntity.ok(new JwtResponse(token,customer));
    }
    
    @PostMapping("/upload-profile")
    public ResponseEntity<HashMap<String,String>> uploadProfile(@RequestParam(required = false,value = "profilePic")
               MultipartFile profilePicImage,Principal principal) throws ResourceNotFoundException{
    	Auth auth=getAuthByJwt(principal);
    	String profileImage= this.customerService.uploadProfilePic(profilePicImage, auth.getId());
    	HashMap<String, String> map=new HashMap<>();
    	map.put("profile_Image", profileImage);
    	return new ResponseEntity<HashMap<String,String>>(map,HttpStatus.OK);
    }
    
    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDto>> getAllCustomer(){
    	List<CustomerDto> customerDtos = customerService.getAllCustomer();
    	return new ResponseEntity<List<CustomerDto>>(customerDtos, HttpStatus.OK);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<Auth> getProfile(Principal principal) throws ResourceNotFoundException {
    	Auth auth= getAuthByJwt(principal);
        Customer customer=(Customer)auth;
        customer.setWalletId(customer.getWallet().getId());
    	return new ResponseEntity<>(auth, HttpStatus.OK);
    }
    
    @PutMapping("/update-profile")
    public ResponseEntity<CustomerDto> updateProfile(@Valid @RequestBody CustomerDto customerDto,Principal principal) throws ResourceNotFoundException{
    	Auth auth=getAuthByJwt(principal);
    	customerDto.setId(auth.getId());
    	CustomerDto customerDto2= customerService.updateProfile(customerDto);
    	return new ResponseEntity<CustomerDto>(customerDto2, HttpStatus.OK);
    }

    @DeleteMapping("/delete-profile")
    public ResponseEntity<String> deleteProfile(Principal principal) throws ResourceNotFoundException{
    	Auth auth=getAuthByJwt(principal);
    	customerService.deleteProfile(auth.getId());
    	return new ResponseEntity<String>("Profile delete successfully", HttpStatus.OK);
    }
    
    
    @PutMapping("/ride/update-book")
    public ResponseEntity<String> updateRide(@RequestBody RideResponse rideResponse,Principal principal) throws ResourceNotFoundException{
    	Auth auth=getAuthByJwt(principal);
    	rideResponse.setUserId(auth.getId());
    	this.rideService.updateRide(rideResponse);;
    	return new ResponseEntity<String>("Ride update sucessfully",HttpStatus.OK);
    }
    
    @GetMapping("ride/get-completed-ride")
    public ResponseEntity<HashMap<String,Object>> getAllCompleteRideByCutomer(Principal principal) throws ResourceNotFoundException{
    	Auth auth=getAuthByJwt(principal);
    	HashMap<String, Object> rideResponses= this.rideService.getAllRideByUser(auth.getId());
    	return new ResponseEntity<>(rideResponses,HttpStatus.OK);
    }
    
   
    
    @DeleteMapping("/ride/delete-book/{rideId}")
    public ResponseEntity<String> deleteRide(@PathVariable("rideId") Long rideId,Principal principal) throws ResourceNotFoundException{
    	Auth auth=getAuthByJwt(principal);
    	
    	this.rideService.deleteRide(rideId,auth.getId());
    	return new ResponseEntity<String>("Ride delete successfully",HttpStatus.OK); 
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
    
    
    public  Auth getAuthByJwt(Principal principal) {
    	CustomUserDetails userDetails= (CustomUserDetails)this.userDetailsServiceImpl.loadUserByUsername(principal.getName());
    	return userDetails.getAuth();
    }
    
    @GetMapping("/get-current-riding")
    public void getCurrentRiding(Principal principal) {
        Auth auth=getAuthByJwt(principal);
    	
		LocalTime to=LocalTime.now();
        LocalTime from=to.plusMinutes(30);
        Instant dateInstant=Instant.now();
        System.out.println(to+" "+from+" "+dateInstant);
        List<Ride> rides=rideRepository.findRidesByDateAndTime(to, from,dateInstant,auth.getId());
        List<Ride> rides2=rideRepository.findAll();
        System.out.println(rides.size()+" "+rides2.size());
    }
    
   
    
    
    
    
}
