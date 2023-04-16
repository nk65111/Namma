package com.namma.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.namma.api.entity.Driver;
import com.namma.api.entity.DriverLocation;

public interface DriverLocationRepository extends JpaRepository<DriverLocation, Long>{
      Optional<DriverLocation> findByDriver(Driver driver);
}
