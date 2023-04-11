package com.namma.api.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.namma.api.dto.CustomerDto;
import com.namma.api.entity.Auth;
import com.namma.api.entity.Customer;
import com.namma.api.exception.OtpNotValidException;
import com.namma.api.exception.PhoneNumberNotFoundException;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.repository.AuthRepository;
import com.namma.api.repository.CustomerRepository;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService{
	
	@Autowired
	private AuthRepository authRepository;
	
	@Autowired
	private CustomerRepository customerRepository;
	
	@Autowired
	private OtpService otpService;
	
	@Autowired
	private BCryptPasswordEncoder  bCryptPasswordEncoder;
	
	 
	@Override
	public void generateOtp(String phoneNumber) {
		Optional<Auth> existingAuth = authRepository.findByPhoneNumber(phoneNumber);
		String token = otpService.generateOtp();
		System.out.println("OTP"+token);
		if(!existingAuth.isPresent()) {
			Auth auth = new Auth();
	    	auth.setPhoneNumber(phoneNumber);
	    	auth.setOtp(bCryptPasswordEncoder.encode(token));
	    	authRepository.save(auth);
		}else {
			Auth auth = existingAuth.get();
			auth.setOtp(bCryptPasswordEncoder.encode(token));
			authRepository.save(auth);
		}
	}
	
	@Override
	public void verifyOtp(String phoneNumber, String otp) throws OtpNotValidException, PhoneNumberNotFoundException {
		// Find auth by phone number
        Optional<Auth> authOptional = authRepository.findByPhoneNumber(phoneNumber);
        
        if (!authOptional.isPresent()) {
            throw new PhoneNumberNotFoundException("Auth not found with phone number: " + phoneNumber);
        }

        Auth auth = authOptional.get();

        // Check if OTP is valid
        if (!otpService.isOtpValid(phoneNumber, otp)) {
            throw new OtpNotValidException("Invalid OTP for phone number: " + phoneNumber);
        }

        // Clear OTP and update driver record
        auth.setOtp(null);
        authRepository.save(auth);
	}

	@Override
	public CustomerDto getProfile(Long customerId) throws ResourceNotFoundException {
		// TODO Auto-generated method stub
		Optional<Customer> customerOptional = customerRepository.findById(customerId);
		Customer customer = customerOptional.orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: "+customerId));
		
		CustomerDto customerDto = new CustomerDto();
		customerDto.setId(customer.getId());
		customerDto.setPhoneNumber(customer.getPhoneNumber());
		customerDto.setGender(customer.getGender());
		customerDto.setName(customer.getName());
		return customerDto;
	}

	@Override
	public void updateProfile(CustomerDto customerDto) throws ResourceNotFoundException {
		// TODO Auto-generated method stub
		Optional<Customer> customerOptional = customerRepository.findById(customerDto.getId());
		Customer customer = customerOptional.orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: "+customerDto.getId()));
		
        customer.setName(customerDto.getName());
        customer.setGender(customerDto.getGender());
        customer.setPhoneNumber(customerDto.getPhoneNumber());
        
        customerRepository.save(customer);
	}

	@Override
	public void deleteProfile(Long customerId)throws ResourceNotFoundException {
		// TODO Auto-generated method stub
		Optional<Customer> customerOptional = customerRepository.findById(customerId);
		Customer customer = customerOptional.orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: "+customerId));
		customerRepository.delete(customer);
	}

	@Override
	public List<CustomerDto> getAllCustomer() {
		// TODO Auto-generated method stub
		List<Customer> customers = customerRepository.findAll();
		
		List<CustomerDto> customerDtos = new ArrayList();
  
		customers.forEach(customer -> {
			CustomerDto customerDto = new CustomerDto();
			customerDto.setGender(customer.getGender());
			customerDto.setId(customer.getId());
			customerDto.setName(customer.getName());
			customerDto.setPhoneNumber(customer.getPhoneNumber());
			
			customerDtos.add(customerDto);
		});
		
		return customerDtos;
	}
	
}
