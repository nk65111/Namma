package com.namma.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.namma.api.entity.RideLocation;

public interface RideLocationRepository extends JpaRepository<RideLocation, Long>{

}
