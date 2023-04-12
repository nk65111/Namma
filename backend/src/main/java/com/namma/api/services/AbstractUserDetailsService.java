package com.namma.api.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.namma.api.enumeration.UserType;

public abstract class AbstractUserDetailsService implements UserDetailsService {
	protected abstract UserDetails loadUserByUsername(String username, UserType userType); 
	protected abstract UserType determineUserType();
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
		UserType userType = determineUserType();
		
		return loadUserByUsername(username, userType);
	}
}
