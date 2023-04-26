package com.namma.api.entity;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.namma.api.enumeration.WalletOwner;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter 
@NoArgsConstructor
@AllArgsConstructor
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "wallet")
    private Customer customer;

    @OneToOne(mappedBy = "wallet")
    private Driver driver;

    private BigDecimal balance;
    
    private String paymentToken;
    
    @Enumerated(EnumType.STRING)
    private WalletOwner walletOwner;

    // Constructors, getters, and setters
}
