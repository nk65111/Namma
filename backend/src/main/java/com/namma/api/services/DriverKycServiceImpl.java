package com.namma.api.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.namma.api.dto.DriverKycDto;
import com.namma.api.entity.DriverKyc;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.repository.DriverKycRepository;

@Service
public class DriverKycServiceImpl implements DriverKycService {

    @Autowired
    private DriverKycRepository driverKycRepository;

    @Override
    public void registerDriverKyc(DriverKycDto driverKycDto) {
        // Map DriverKycDto to DriverKyc entity
        DriverKyc driverKyc = new DriverKyc();
        driverKyc.setDrivingLicenseNumber(driverKycDto.getDrivingLicenseNumber());
        driverKyc.setBankname(driverKycDto.getBankName());
        driverKyc.setBankAccountNumber(driverKycDto.getBankAccountNumber());
        driverKyc.setIfscCode(driverKycDto.getIfscCode());
        driverKyc.setAccountHolderName(driverKycDto.getAccountHolderName());
        driverKyc.setVehicleRegistrationNumber(driverKycDto.getVehicleRegistrationNumber());
        driverKyc.setVehicleModel(driverKycDto.getVehicleModel());
        driverKyc.setSelfie(driverKycDto.getSelfie());

        // Save DriverKyc entity to database
        driverKycRepository.save(driverKyc);
    }

    @Override
    public DriverKycDto getDriverKycDetails(long driverId) throws ResourceNotFoundException {
        // Get DriverKyc entity from database
        Optional<DriverKyc> optionalDriverKyc = driverKycRepository.findById(driverId);
        
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
            driverKycDto.setSelfie(driverKyc.getSelfie());
            return driverKycDto;
        } else {
            throw new ResourceNotFoundException("Driver KYC details not found for driver id: " + driverId);
        }
    }
}
