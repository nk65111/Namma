package com.namma.api.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.namma.api.entity.Auth;
import com.namma.api.repository.AuthRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserDetailsServiceImpl implements UserDetailsService{
	
	@Autowired
	private AuthRepository authRepository;

	@Override
	public UserDetails loadUserByUsername(String phoneNumber) throws UsernameNotFoundException {
		Optional<Auth> authOptional=this.authRepository.findByPhoneNumber(phoneNumber);
		if(authOptional.get()==null){
            log.info("User not found of this number:{}",phoneNumber);
            throw  new UsernameNotFoundException("User not found");
        }
        return  authOptional.get();
	}

}
