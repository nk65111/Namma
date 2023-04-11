package com.namma.api.services;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.namma.api.dto.CustomerDto;
import com.namma.api.dto.DriverDto;
import com.namma.api.dto.DriverKycDto;
import com.namma.api.entity.Auth;
import com.namma.api.entity.Customer;
import com.namma.api.entity.Driver;
import com.namma.api.entity.DriverKyc;
import com.namma.api.exception.OtpNotValidException;
import com.namma.api.exception.PhoneNumberNotFoundException;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.repository.DriverKycRepository;
import com.namma.api.repository.DriverRepository;
import com.namma.api.utility.UploadFileUtility;

@Service
public class DriverServiceImpl implements DriverService {

    @Autowired
    private DriverKycRepository driverKycRepository;
    
    @Autowired
    private DriverRepository driverRepository;
    
    @Autowired
    private UploadFileUtility uploadFileUtility;
    
    @Autowired
	private OtpService otpService;
	
	@Autowired
	private BCryptPasswordEncoder  bCryptPasswordEncoder;
    
    
    public void generateOtp(String phoneNumber) {
		Optional<Driver> existingAuth = driverRepository.findByPhoneNumber(phoneNumber);
		String token = otpService.generateOtp();
		System.out.println("OTP"+token);
		if(!existingAuth.isPresent()) {
			Driver driver = new Driver();
			driver.setPhoneNumber(phoneNumber);
			driver.setOtp(bCryptPasswordEncoder.encode(token));
	    	driverRepository.save(driver);
		}else {
			Driver driver = existingAuth.get();
			driver.setOtp(bCryptPasswordEncoder.encode(token));
			driverRepository.save(driver);
		} 
	}
	
	public void verifyOtp(String phoneNumber, String otp) throws OtpNotValidException, PhoneNumberNotFoundException {
		// Find auth by phone number
        Optional<Driver> driverOptional = driverRepository.findByPhoneNumber(phoneNumber);
        
        if (!driverOptional.isPresent()) {
            throw new PhoneNumberNotFoundException("Driver not found with phone number: " + phoneNumber);
        }

        Driver driver = driverOptional.get();

        // Check if OTP is valid
        if (!otpService.isOtpValid(phoneNumber, otp)) {
            throw new OtpNotValidException("Invalid OTP for phone number: " + phoneNumber);
        }

        // Clear OTP and update driver record
        driver.setOtp(null);
        driverRepository.save(driver);
	}
    

    @Override
    public void registerDriverKyc(DriverKycDto driverKycDto) throws ResourceNotFoundException {
        // Map DriverKycDto to DriverKyc entity
        DriverKyc driverKyc = new DriverKyc();
        driverKyc.setDrivingLicenseNumber(driverKycDto.getDrivingLicenseNumber());
        driverKyc.setBankname(driverKycDto.getBankName());
        driverKyc.setBankAccountNumber(driverKycDto.getBankAccountNumber());
        driverKyc.setIfscCode(driverKycDto.getIfscCode());
        driverKyc.setAccountHolderName(driverKycDto.getAccountHolderName());
        driverKyc.setVehicleRegistrationNumber(driverKycDto.getVehicleRegistrationNumber());
        driverKyc.setVehicleModel(driverKycDto.getVehicleModel());
        driverKyc.setKycSubmittedAt(new Date().toString());
        
        Optional<Driver> driverOptional= driverRepository.findById(driverKycDto.getAuthId());
//        if(driverOptional.get()==null) {
//        	throw new ResourceNotFoundException("User is not found ");
//        }else {
//        	driverKyc.setAuth(driverOptional.get());
//        }
        
        //convert selfie image to url using cloudnary
        String selfieUrl = uploadFileUtility.uploadFile(driverKycDto.getSelfieImage());
        driverKyc.setSelfie(selfieUrl);
        
        //convert driving licence to url using cloudinary
        String drivingLicenceUrl=uploadFileUtility.uploadFile(driverKycDto.getDrivingLicenceImage());
        driverKyc.setDrivingLicenceImgae(drivingLicenceUrl);

        // Save DriverKyc entity to database
        driverKycRepository.save(driverKyc);
    }

    @Override
    public DriverKycDto getDriverKycDetails(long driverId) throws ResourceNotFoundException {
    	
    	Optional<Driver> driverOptional= driverRepository.findById(driverId);
    	if(driverOptional.get()==null) {
    		throw new ResourceNotFoundException("Driver is not found");
    	}
    	
    	
        // Get DriverKyc entity from database
        Optional<DriverKyc> optionalDriverKyc = driverKycRepository.findByDriver(driverOptional.get());
        
        
        if (optionalDriverKyc.isPresent()) {
            // Map DriverKyc entity to DriverKycDto
            DriverKyc driverKyc = optionalDriverKyc.get();
            DriverKycDto driverKycDto = new DriverKycDto();
            driverKycDto.setId(driverKyc.getId());
            driverKycDto.setDrivingLicenseNumber(driverKyc.getDrivingLicenseNumber());
            driverKycDto.setBankName(driverKyc.getBankname());
            driverKycDto.setBankAccountNumber(driverKyc.getBankAccountNumber());
            driverKycDto.setIfscCode(driverKyc.getIfscCode());
            driverKycDto.setAccountHolderName(driverKyc.getAccountHolderName());
            driverKycDto.setVehicleRegistrationNumber(driverKyc.getVehicleRegistrationNumber());
            driverKycDto.setVehicleModel(driverKyc.getVehicleModel());
//            driverKycDto.setSelfie(driverKyc.getSelfie());
            return driverKycDto;
        } else {
            throw new ResourceNotFoundException("Driver KYC details not found for driver");
        }
    }
    

	@Override
	public List<DriverDto> getAllDriver() {
		// TODO Auto-generated method stub
		List<Driver> drivers = driverRepository.findAll();
		
		List<DriverDto> driverDtos = new ArrayList();
  
		drivers.forEach(driver -> {
			DriverDto driverDto = new DriverDto();
			driverDto.setId(driver.getId());
			driverDto.setAge(driver.getAge());
			driverDto.setKycStatus(driver.getKycStatus());
			driverDto.setName(driver.getName());
			driverDto.setOnboardingStep(driver.getOnboardingStep());
			driverDto.setPhoneNumber(driver.getPhoneNumber());
			
			driverDtos.add(driverDto);
		});
		
		return driverDtos;
	}

	@Override
	public DriverDto getProfile(Long driverId) throws ResourceNotFoundException {
		// TODO Auto-generated method stub
		Optional<Driver> customerOptional = driverRepository.findById(driverId);
		Driver driver = customerOptional.orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: "+driverId));
		
		DriverDto driverDto = new DriverDto();
		driverDto.setId(driver.getId());
		driverDto.setPhoneNumber(driver.getPhoneNumber());
		driverDto.setName(driver.getName());
		driverDto.setAge(driver.getAge());
		driverDto.setKycStatus(driver.getKycStatus());
		driverDto.setOnboardingStep(driver.getOnboardingStep());
        
		return driverDto;
	}

	@Override
	public void updateProfile(DriverDto driverDto) throws ResourceNotFoundException {
		// TODO Auto-generated method stub
		Optional<Driver> customerOptional = driverRepository.findById(driverDto.getId());
		Driver driver = customerOptional.orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: "+driverDto.getId()));
		
		driver.setName(driverDto.getName());
		driver.setPhoneNumber(driverDto.getPhoneNumber());
		driver.setAge(driverDto.getAge());
		//driver.setDriverKyc(driverDto.getDriverKyc());
        driver.setKycStatus(driverDto.getKycStatus());
        driver.setOnboardingStep(driverDto.getOnboardingStep());
        driver.setId(driverDto.getId());
        
        driverRepository.save(driver);
	}

	@Override
	public void deleteProfile(Long driverId) throws ResourceNotFoundException {
		// TODO Auto-generated method stub
		Optional<Driver> customerOptional = driverRepository.findById(driverId);
		Driver driver = customerOptional.orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: "+driverId));
		driverRepository.delete(driver);

	}
}
