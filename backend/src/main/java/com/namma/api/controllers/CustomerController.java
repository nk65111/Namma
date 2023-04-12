package com.namma.api.controllers;

import java.security.Principal;
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
import com.namma.api.dto.CustomerDto;
import com.namma.api.dto.JwtRequest;
import com.namma.api.dto.JwtResponse;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.services.AbstractUserDetailsService;
import com.namma.api.services.CustomerService;

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
    private JwtUtil jwtUtil;
	
	@PostMapping("/generateOtp")
	public ResponseEntity<String> generateOtp(@RequestParam("phoneNumber") String phoneNumber) {
		customerService.generateOtp(phoneNumber);
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
    
    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDto>> getAllCustomer(){
    	List<CustomerDto> customerDtos = customerService.getAllCustomer();
    	return new ResponseEntity<List<CustomerDto>>(customerDtos, HttpStatus.OK);
    }
    
    @GetMapping("/profile/{customerId}")
    public ResponseEntity<CustomerDto> getProfile(@PathVariable("customerId") Long customerId) throws ResourceNotFoundException {
    	CustomerDto customerDto = customerService.getProfile(customerId);
    	return new ResponseEntity<CustomerDto>(customerDto, HttpStatus.OK);
    }
    
    @PutMapping("/update-profile")
    public ResponseEntity<String> updateProfile(@Valid @RequestBody CustomerDto customerDto) throws ResourceNotFoundException{
    	customerService.updateProfile(customerDto);
    	return new ResponseEntity<String>("Profile updated successfully", HttpStatus.OK);
    }

    @DeleteMapping("/delete-profile/{customerId}")
    public ResponseEntity<String> deleteProfile(@PathVariable Long customerId) throws ResourceNotFoundException{
    	customerService.deleteProfile(customerId);
    	return new ResponseEntity<String>("Profile updated successfully", HttpStatus.OK);
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
    
}
