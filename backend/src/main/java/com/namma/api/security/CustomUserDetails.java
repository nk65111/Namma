package com.namma.api.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.namma.api.entity.Auth;
import com.namma.api.entity.Customer;
import com.namma.api.entity.Driver;

import lombok.Data;

@Data
public class CustomUserDetails implements UserDetails {
	private static final long serialVersionUID = 1L;
	
	Auth auth;
	 
	private String username;
    private String password;
    private List<GrantedAuthority> authorities;

    public CustomUserDetails(String username, String password, List<GrantedAuthority> authorities) {
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    public CustomUserDetails(Customer customer) {
    	auth=customer;
		username = customer.getPhoneNumber();
		password=customer.getOtp();
	}

	public CustomUserDetails(Driver driver) {
		auth=driver;
		username = driver.getPhoneNumber();
		password=driver.getOtp();
	}

	@Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
