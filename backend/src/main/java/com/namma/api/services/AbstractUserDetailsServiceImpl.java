package com.namma.api.services;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.namma.api.entity.Customer;
import com.namma.api.entity.Driver;
import com.namma.api.enumeration.UserType;
import com.namma.api.repository.CustomerRepository;
import com.namma.api.repository.DriverRepository;
import com.namma.api.security.CustomUserDetails;

@Service
@Transactional
public class AbstractUserDetailsServiceImpl extends AbstractUserDetailsService {
	
	@Autowired
	private DriverRepository driverRepository;
	
	@Autowired
	private CustomerRepository customerRepository;


	@Override
	protected UserDetails loadUserByUsername(String username, UserType userType) {
		if(userType == UserType.CUSTOMER) {
			Customer customer = customerRepository.findByPhoneNumber(username)
					.orElseThrow(() -> new UsernameNotFoundException("Customer not found with phonenumber: "+username));
			return new CustomUserDetails(customer);
			
		}else if(userType == UserType.DRIVER) {
			Driver driver = driverRepository.findByPhoneNumber(username)
					.orElseThrow(() -> new UsernameNotFoundException("Driver not found with phonenumber: "+username));
			return new CustomUserDetails(driver);
			
		}
		throw new IllegalArgumentException("Invalid user type: " + userType);
	}

	@Override
	protected UserType determineUserType() {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String requestURI = request.getRequestURI();
        if (requestURI.contains("/customer/")||requestURI.contains("wallet")) {
            return UserType.CUSTOMER;
        } else if (requestURI.contains("/driver/")) {
            return UserType.DRIVER;
        }
        throw new IllegalArgumentException("Unknown request URI: " + requestURI);
    
	}

}
