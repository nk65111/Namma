package com.namma.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.namma.api.entity.Auth;

public interface AuthRepository extends JpaRepository<Auth, Long>{

	Optional<Auth> findByPhoneNumber(String phoneNumber);

}
