package com.namma.api.entity;

import java.util.Collection;
import java.util.Collections;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.namma.api.enumeration.AuthType;
import com.namma.api.enumeration.Gender;
import com.namma.api.enumeration.KycStatus;
import com.namma.api.enumeration.KycStep;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auth implements UserDetails{
	@Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long Id;
	
	@NotNull(message = "Phone number is required")
	private String phoneNumber;
	
	private String name;
	
	@Enumerated(EnumType.STRING)
	private Gender gender;
	
	@Enumerated(EnumType.STRING)
	private AuthType authType;
	
	@Enumerated(EnumType.STRING)
	private KycStatus kycStatus;
	
	@Enumerated(EnumType.STRING)
	private KycStep onboardingStep;
	
	private String otp;
	
	@OneToOne(mappedBy = "auth")
	private DriverKyc driverKyc;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();

	}

	@Override
	public String getPassword() {
		return otp;
	}
	
	@Override
	public String getUsername() {
		return phoneNumber;
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
