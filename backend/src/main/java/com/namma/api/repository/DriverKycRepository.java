package com.namma.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.namma.api.entity.Driver;
import com.namma.api.entity.DriverKyc;

@Repository
public interface DriverKycRepository extends JpaRepository<DriverKyc, Long> {
	Optional<DriverKyc> findByDriver(Driver driver);
} 
