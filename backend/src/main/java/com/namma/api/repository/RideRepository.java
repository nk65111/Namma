package com.namma.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.namma.api.entity.Ride;

public interface RideRepository extends JpaRepository<Ride, Long>{

}
