package com.namma.api.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.namma.api.dto.CustomerDto;
import com.namma.api.dto.WalletDto;
import com.namma.api.entity.Customer;
import com.namma.api.entity.Wallet;
import com.namma.api.enumeration.WalletOwner;
import com.namma.api.exception.OtpNotValidException;
import com.namma.api.exception.PhoneNumberNotFoundException;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.repository.CustomerRepository;
import com.namma.api.repository.WalletRepository;
import com.namma.api.utility.UploadFileUtility;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService{
	
	@Autowired
	private CustomerRepository customerRepository;
	
	@Autowired
	private OtpService otpService;
	
	@Autowired
	private BCryptPasswordEncoder  bCryptPasswordEncoder;
	
	@Autowired
	private WalletRepository walletRepository;
	
	@Autowired
	private UploadFileUtility uploadFileUtility;
	
	 
	@Override
	public String generateOtp(String phoneNumber) {
		Optional<Customer> existingAuth = customerRepository.findByPhoneNumber(phoneNumber);
		String token = otpService.generateOtp();
		System.out.println("OTP"+token);
		if(!existingAuth.isPresent()) {
			Customer customer = new Customer();
			customer.setPhoneNumber(phoneNumber);
			customer.setOtp(bCryptPasswordEncoder.encode(token));
			customer.setProfileImage("https://res.cloudinary.com/die9o5d6p/image/upload/v1682528550/images_osacrv.png");
			customer.setCreatedAt(LocalDateTime.now());
			Wallet wallet = new Wallet();
	        wallet.setCustomer(customer);
	        wallet.setWalletOwner(WalletOwner.CUSTOMER);
	        wallet.setBalance(new BigDecimal(500));
	        walletRepository.save(wallet);
	        customer.setWallet(wallet);
	    	customerRepository.save(customer);
		}else {
			Customer customer = existingAuth.get();
			customer.setOtp(bCryptPasswordEncoder.encode(token));
			customerRepository.save(customer);
		}
		return token;
		
	}
	
	@Override
	public void verifyOtp(String phoneNumber, String otp) throws OtpNotValidException, PhoneNumberNotFoundException {
		// Find auth by phone number
        Optional<Customer> authOptional = customerRepository.findByPhoneNumber(phoneNumber);
        
        if (!authOptional.isPresent()) {
            throw new PhoneNumberNotFoundException("Auth not found with phone number: " + phoneNumber);
        }

        Customer auth = authOptional.get();
        // Check if OTP is valid
        if (!otpService.isOtpValid(phoneNumber, otp)) {
            throw new OtpNotValidException("Invalid OTP for phone number: " + phoneNumber);
        }
        
       

        // Clear OTP and update driver record
        auth.setOtp(null);
        customerRepository.save(auth);
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
		customerDto.setProfileImage(customer.getProfileImage());
		customerDto.setWalletId(customer.getWallet().getId());
		return customerDto;
	}
	

	@Override
	public CustomerDto updateProfile(CustomerDto customerDto) throws ResourceNotFoundException {
		// TODO Auto-generated method stub
		
		Optional<Customer> customerOptional = customerRepository.findById(customerDto.getId());
		Customer customer = customerOptional.orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: "+customerDto.getId()));
		
        customer.setName(customerDto.getName());
        customer.setGender(customerDto.getGender());
        customer.setUpdatedAt(LocalDateTime.now());
        customer.setDeviceToken(customerDto.getDeviceToken());
        
       Customer savedCustomer=customerRepository.save(customer);
       CustomerDto saveCustomerDto = new CustomerDto();
       saveCustomerDto.setGender(savedCustomer.getGender());
       saveCustomerDto.setId(savedCustomer.getId());
       saveCustomerDto.setName(savedCustomer.getName());
       saveCustomerDto.setPhoneNumber(savedCustomer.getPhoneNumber());
       saveCustomerDto.setWalletId(savedCustomer.getWallet().getId());
       saveCustomerDto.setProfileImage(savedCustomer.getProfileImage());
       saveCustomerDto.setDeviceToken(savedCustomer.getDeviceToken());
       return saveCustomerDto;
       
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
			customerDto.setWalletId(customer.getWallet().getId());
			customerDto.setProfileImage(customer.getProfileImage());
			customerDto.setDeviceToken(customer.getDeviceToken());
			customerDtos.add(customerDto);
		});
		
		return customerDtos;
	}

	@Override
	public String uploadProfilePic(MultipartFile profilePic,Long custId) throws ResourceNotFoundException {
		if(profilePic!=null) {
			Optional<Customer> customerOptional = customerRepository.findById(custId);
			Customer customer = customerOptional.orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: "+custId));
			String profileUploadedLink=this.uploadFileUtility.uploadFile(profilePic);
			customer.setProfileImage(profileUploadedLink);
			this.customerRepository.save(customer);
			return profileUploadedLink;
		}else {
			return "https://res.cloudinary.com/die9o5d6p/image/upload/v1682528550/images_osacrv.png";
		}
		
	}
	
}
