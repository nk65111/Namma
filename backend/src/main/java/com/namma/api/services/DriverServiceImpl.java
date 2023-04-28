package com.namma.api.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.namma.api.dto.CustomerDto;
import com.namma.api.dto.DriverDto;
import com.namma.api.dto.DriverKycDto;
import com.namma.api.dto.DriverLocationDto;
import com.namma.api.entity.Auth;
import com.namma.api.entity.Customer;
import com.namma.api.entity.Driver;
import com.namma.api.entity.DriverKyc;
import com.namma.api.entity.DriverLocation;
import com.namma.api.entity.Wallet;
import com.namma.api.enumeration.KycStatus;
import com.namma.api.enumeration.KycStep;
import com.namma.api.enumeration.WalletOwner;
import com.namma.api.exception.OtpNotValidException;
import com.namma.api.exception.PhoneNumberNotFoundException;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.repository.DriverKycRepository;
import com.namma.api.repository.DriverLocationRepository;
import com.namma.api.repository.DriverRepository;
import com.namma.api.repository.WalletRepository;
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
	
	@Autowired
	private DriverLocationRepository driverLocationRepository;
	
	@Autowired
	private WalletRepository walletRepository;
    
    
    public String generateOtp(String phoneNumber) {
		Optional<Driver> existingAuth = driverRepository.findByPhoneNumber(phoneNumber);
		String token = otpService.generateOtp();
		System.out.println("OTP"+token);
		if(!existingAuth.isPresent()) {
			Driver driver = new Driver();
			driver.setPhoneNumber(phoneNumber);
			driver.setOtp(bCryptPasswordEncoder.encode(token));
			driver.setCreatedAt(LocalDateTime.now());
			driver.setActive(false);
			driver.setIsAvilable(false);
			driver.setOnboardingStep(KycStep.DRIVING_LICENCE);
			driver.setKycStatus(KycStatus.NOT_COMPLETED);
			Driver saveDriver = driverRepository.save(driver);
			
			Wallet wallet = new Wallet();
	        wallet.setDriver(saveDriver);
	        wallet.setWalletOwner(WalletOwner.DRIVER);
	        wallet.setBalance(new BigDecimal(500));
	        walletRepository.save(wallet);
	        saveDriver.setWallet(wallet);
	    	driverRepository.save(saveDriver);
	    	
	        DriverKyc driverKyc = new DriverKyc();
	        driverKyc.setCreatedAt(LocalDateTime.now());
	        driverKyc.setDriver(saveDriver);
	        this.driverKycRepository.save(driverKyc);
	        
		}else {
			Driver driver = existingAuth.get();
			driver.setOtp(bCryptPasswordEncoder.encode(token));
			driver.setCreatedAt(LocalDateTime.now());
			driverRepository.save(driver);
		}
		
		return token;
	}
	
	public void verifyOtp(String phoneNumber, String otp, String deviceToken) throws OtpNotValidException, PhoneNumberNotFoundException {
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
    

//    @Override
//    public void registerDriverKyc(DriverKycDto driverKycDto) throws ResourceNotFoundException {
//        // Map DriverKycDto to DriverKyc entity
//    	
//        DriverKyc driverKyc = new DriverKyc();
//       
//        driverKyc.setBankname(driverKycDto.getBankName());
//        driverKyc.setBankAccountNumber(driverKycDto.getBankAccountNumber());
//        driverKyc.setIfscCode(driverKycDto.getIfscCode());
//        driverKyc.setAccountHolderName(driverKycDto.getAccountHolderName());
//        
//        driverKyc.setVehicleModel(driverKycDto.getVehicleModel());
//        
//        
//        Optional<Driver> driverOptional= driverRepository.findById(driverKycDto.getAuthId());
//        if(driverOptional.get()==null) {
//        	throw new ResourceNotFoundException("User is not found ");
//        }else {
//        	driverKyc.setDriver(driverOptional.get());
//        }
//        
//        //convert selfie image to url using cloudnary
//        if(driverKycDto.getSelfieImage()!=null) {
//        	String selfieUrl = uploadFileUtility.uploadFile(driverKycDto.getSelfieImage());
//            driverKyc.setSelfie(selfieUrl);
//        }else {
//        	driverKyc.setSelfie("https://res.cloudinary.com/die9o5d6p/image/upload/v1682528550/images_osacrv.png");
//        }
//        
//        
//        //convert driving licence to url using cloudinary
//        if(driverKycDto.getDrivingLicenceImage()!=null) {
//        	String drivingLicenceUrl=uploadFileUtility.uploadFile(driverKycDto.getDrivingLicenceImage());
//            driverKyc.setDrivingLicenceImgae(drivingLicenceUrl);
//        }else {
//        	driverKyc.setDrivingLicenceImgae("https://res.cloudinary.com/die9o5d6p/image/upload/v1682528550/images_osacrv.png");
//        }
//        
//        
//        
//        //set driver kyc status
//        //todo
//
//        // Save DriverKyc entity to database
//        driverKycRepository.save(driverKyc);
//    }

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
            driverKycDto.setSelfieImageLink(driverKyc.getSelfie());
            driverKycDto.setDriverLicenceImageLink(driverKyc.getDrivingLicenceImgae());
            driverKycDto.setAuthId(driverKyc.getDriver().getId());
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
		
		if(driverDto.getName() != null && driverDto.getName().length() != 0) {
			driver.setName(driverDto.getName());
		}
		
		if(driverDto.getDeviceToken() != null && driverDto.getDeviceToken().length() != 0) {
			driver.setDeviceToken(driverDto.getDeviceToken());
		}
		
		if(driverDto.getAge() != null ) {
			driver.setAge(driverDto.getAge());
		}
		
		if(driverDto.getKycStatus() != null ) {
			driver.setKycStatus(driverDto.getKycStatus());
		}
		
		if(driverDto.getOnboardingStep() != null ) {
			driver.setOnboardingStep(driverDto.getOnboardingStep());
		}
		
        driver.setUpdatedAt(LocalDateTime.now());
        driverRepository.save(driver);
	}

	@Override
	public void deleteProfile(Long driverId) throws ResourceNotFoundException {
		// TODO Auto-generated method stub
		Optional<Driver> customerOptional = driverRepository.findById(driverId);
		Driver driver = customerOptional.orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: "+driverId));
		DriverKyc driverKyc= this.driverKycRepository.findByDriver(driver).get();
		this.driverKycRepository.delete(driverKyc);
		driverRepository.delete(driver);

	}

	@Override
	public void updateDriverLocation(DriverLocationDto driverLocationDto) throws ResourceNotFoundException {
		Optional<Driver> driverOptional= this.driverRepository.findById(driverLocationDto.getDrivingId());
		Driver driver=driverOptional.orElseThrow(()-> new ResourceNotFoundException("Driver is noy found with id:"+driverLocationDto.getDrivingId()));
		
		Optional<DriverLocation> driverLocationOptional=this.driverLocationRepository.findByDriver(driver);
	    if(driverLocationOptional.isPresent()==false) {
		    DriverLocation driverLocation=new DriverLocation();
		    driverLocation.setDriver(driver);
		    driverLocation.setLatitude(driverLocationDto.getLatitude());
		    driverLocation.setLongitutde(driverLocationDto.getLongitutde());
		    this.driverLocationRepository.save(driverLocation);
	    }else {
		    DriverLocation driverLocation=driverLocationOptional.get();
		    driverLocation.setLatitude(driverLocationDto.getLatitude());
		    driverLocation.setLongitutde(driverLocationDto.getLongitutde());
		    this.driverLocationRepository.save(driverLocation);
	    }
	   
	}

	@Override
	public DriverDto uploadLicence(MultipartFile licence, Long driverId) throws ResourceNotFoundException {
		Optional<Driver> driverOptional= driverRepository.findById(driverId);
		Driver driver = driverOptional.orElseThrow(() -> new ResourceNotFoundException("Driver is not found"));
    	
    	Optional<DriverKyc> driverKycOptional= driverKycRepository.findByDriver(driver);
    	DriverKyc driverKyc = driverKycOptional.orElseThrow(() -> new ResourceNotFoundException("Driver Kyc is not found"));
    	
    	String drivingLicenceUrl="https://res.cloudinary.com/die9o5d6p/image/upload/v1682528550/images_osacrv.png";
    	if(licence!=null) {
        	drivingLicenceUrl=uploadFileUtility.uploadFile(licence);
            driverKyc.setDrivingLicenceImgae(drivingLicenceUrl);
        }else {
        	driverKyc.setDrivingLicenceImgae(drivingLicenceUrl);
        }
    	
    	driver.setKycStatus(KycStatus.PARTIALLY_COMPLETED);
        driver.setOnboardingStep(KycStep.BANK_DETAIL);
    	driverRepository.save(driver);
    	driverKycRepository.save(driverKyc);
    	return entityToDto(driver);
	}

	@Override
	public DriverDto uploadBankDetails(DriverKycDto driverKycDto, Long driverId) throws ResourceNotFoundException {
		Optional<Driver> driverOptional= driverRepository.findById(driverId);
		Driver driver = driverOptional.orElseThrow(() -> new ResourceNotFoundException("Driver is not found"));

		Optional<DriverKyc> driverKycOptional= driverKycRepository.findByDriver(driver);
    	DriverKyc driverKyc = driverKycOptional.orElseThrow(() -> new ResourceNotFoundException("Driver Kyc is not found"));
    	
    	driverKyc.setBankname(driverKycDto.getBankName());
    	driverKyc.setBankAccountNumber(driverKycDto.getBankAccountNumber());
    	driverKyc.setIfscCode(driverKycDto.getIfscCode());
    	driverKyc.setAccountHolderName(driverKycDto.getAccountHolderName());
    	driverKycRepository.save(driverKyc);
    	
    	//update step
    	driver.setOnboardingStep(KycStep.VEHICLE_DETAIL);
    	driverRepository.save(driver);
    	return entityToDto(driver);
		
	}

	@Override
	public DriverDto uploadVehicleDetails(DriverKycDto driverKycDto, Long driverId) throws ResourceNotFoundException {
		Optional<Driver> driverOptional= driverRepository.findById(driverId);
		Driver driver = driverOptional.orElseThrow(() -> new ResourceNotFoundException("Driver is not found"));

		Optional<DriverKyc> driverKycOptional= driverKycRepository.findByDriver(driver);
    	DriverKyc driverKyc = driverKycOptional.orElseThrow(() -> new ResourceNotFoundException("Driver Kyc is not found"));
    	
    	driverKyc.setVehicleModel(driverKycDto.getVehicleModel());
    	driverKyc.setDrivingLicenseNumber(driverKycDto.getDrivingLicenseNumber());
    	driverKyc.setVehicleRegistrationNumber(driverKycDto.getVehicleRegistrationNumber());
    	driverKycRepository.save(driverKyc);
    	
    	//update step
    	driver.setOnboardingStep(KycStep.PROFILE_PIC);
    	driverRepository.save(driver);
    	return entityToDto(driver);
	}

	
	@Override
	public DriverDto uploadSelfie(MultipartFile selfie, Long driverId) throws ResourceNotFoundException {
		Optional<Driver> driverOptional= driverRepository.findById(driverId);
		Driver driver = driverOptional.orElseThrow(() -> new ResourceNotFoundException("Driver is not found"));

		Optional<DriverKyc> driverKycOptional= driverKycRepository.findByDriver(driver);
    	DriverKyc driverKyc = driverKycOptional.orElseThrow(() -> new ResourceNotFoundException("Driver Kyc is not found"));
    	
    	String selieUrl="https://res.cloudinary.com/die9o5d6p/image/upload/v1682528550/images_osacrv.png";
    	if(selfie!=null) {
    		selieUrl=uploadFileUtility.uploadFile(selfie);
            driverKyc.setDrivingLicenceImgae(selieUrl);
        }else {
        	driverKyc.setDrivingLicenceImgae(selieUrl);
        }
    	
    	driver.setKycStatus(KycStatus.COMPLETED);
    	driverRepository.save(driver);
    	driverKycRepository.save(driverKyc);
    	return entityToDto(driver);
	}
	
	
	public DriverDto entityToDto(Driver driver) {
		DriverDto dto = new DriverDto();
		dto.setAge(driver.getAge());
		dto.setDeviceToken(driver.getDeviceToken());
		dto.setId(driver.getId());
		dto.setKycStatus(driver.getKycStatus());
		dto.setName(driver.getName());
		dto.setOnboardingStep(driver.getOnboardingStep());
		dto.setOtp(driver.getOtp());
		dto.setPhoneNumber(driver.getPhoneNumber());
		dto.setWalletId(driver.getWallet().getId());
		return dto;
	}
	
}
