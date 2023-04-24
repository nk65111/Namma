package com.namma.api.controllers;

import java.security.Principal;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.namma.api.config.JwtUtil;
import com.namma.api.config.SheduleRide;
import com.namma.api.dto.CustomerDto;
import com.namma.api.dto.JwtRequest;
import com.namma.api.dto.JwtResponse;
import com.namma.api.dto.RideDto;
import com.namma.api.dto.RideResponse;
import com.namma.api.entity.Auth;
import com.namma.api.entity.Customer;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.security.CustomUserDetails;
import com.namma.api.services.AbstractUserDetailsService;
import com.namma.api.services.AbstractUserDetailsServiceImpl;
import com.namma.api.services.CustomerService;
import com.namma.api.services.RideService;

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
	private RideService rideService;
	
	@PostMapping("/generateOtp")
	public ResponseEntity<String> generateOtp(@RequestParam("phoneNumber") String phoneNumber) {
		customerService.generateOtp(phoneNumber);
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
        this.sheduleRide.auth=customUserDetails.getAuth();
        return  ResponseEntity.ok(new JwtResponse(token));
    }
    
    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDto>> getAllCustomer(){
    	List<CustomerDto> customerDtos = customerService.getAllCustomer();
    	return new ResponseEntity<List<CustomerDto>>(customerDtos, HttpStatus.OK);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<Auth> getProfile(Principal principal) throws ResourceNotFoundException {
    	Auth auth= getAuthByJwt(principal);
    	return new ResponseEntity<>(auth, HttpStatus.OK);
    }
    
    @PutMapping("/update-profile")
    public ResponseEntity<String> updateProfile(@Valid @RequestBody CustomerDto customerDto,Principal principal) throws ResourceNotFoundException{
    	Auth auth=getAuthByJwt(principal);
    	customerDto.setId(auth.getId());
    	customerService.updateProfile(customerDto);
    	return new ResponseEntity<String>("Profile updated successfully", HttpStatus.OK);
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
    
    public Auth getAuthByJwt(Principal principal) {
    	CustomUserDetails userDetails= (CustomUserDetails)this.userDetailsServiceImpl.loadUserByUsername(principal.getName());
    	return userDetails.getAuth();
    }
    
    
    
    
}
