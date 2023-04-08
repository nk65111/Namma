package com.namma.api.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.namma.api.config.JwtUtil;
import com.namma.api.dto.AuthDto;
import com.namma.api.entity.Auth;
import com.namma.api.entity.JwtRequest;
import com.namma.api.entity.JwtResponse;
import com.namma.api.exception.PhoneNumberNotFoundException;
import com.namma.api.services.AuthService;
import com.namma.api.services.UserDetailsServiceImpl;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
	
	@Autowired
	private AuthService authService;
	
	@Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;
	
	@PostMapping("/generateOtp")
	public ResponseEntity<String> generateOtp(@RequestParam("phoneNumber") String phoneNumber) {
		authService.generateOtp(phoneNumber);
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
	
	
	@PutMapping("/profile")
	public ResponseEntity<String> updateProfile(AuthDto authDto) throws PhoneNumberNotFoundException{
		authService.updateProfile(authDto);
		return new ResponseEntity<>("Profile updated successfully", HttpStatus.OK); 
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
