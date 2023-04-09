package com.namma.api.services;

import java.util.*;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.namma.api.dto.DriverKycDto;
import com.namma.api.entity.Auth;
import com.namma.api.entity.DriverKyc;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.repository.AuthRepository;
import com.namma.api.repository.DriverKycRepository;
import com.namma.api.utility.UploadFileUtility;

@Service
public class DriverKycServiceImpl implements DriverKycService {

    @Autowired
    private DriverKycRepository driverKycRepository;
    
    @Autowired
    private AuthRepository authRepository;
    
    @Autowired
    private UploadFileUtility uploadFileUtility;

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
        
        Optional<Auth> authOptional=this.authRepository.findById(driverKycDto.getAuthId());
        if(authOptional.get()==null) {
        	throw new ResourceNotFoundException("User is not found ");
        }else {
        	driverKyc.setAuth(authOptional.get());
        }
        
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
    public DriverKycDto getDriverKycDetails(long authId) throws ResourceNotFoundException {
    	
    	Optional<Auth> authOptional=this.authRepository.findById(authId);
    	if(authOptional.get()==null) {
    		throw new ResourceNotFoundException("User is not found");
    	}
    	
    	
        // Get DriverKyc entity from database
        Optional<DriverKyc> optionalDriverKyc = driverKycRepository.findByAuth(authOptional.get());
        
        
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
}
