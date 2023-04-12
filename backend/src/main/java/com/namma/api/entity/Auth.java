package com.namma.api.entity;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@MappedSuperclass
public class Auth implements Serializable{
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Id
	@EqualsAndHashCode.Include
	private Long id;
	
	@NotNull(message = "Phone number is required")
	private String phoneNumber;
	
	private String name; 
	
	private String otp;
}
