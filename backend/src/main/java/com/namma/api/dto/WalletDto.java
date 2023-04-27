package com.namma.api.dto;


import java.math.BigDecimal;

import com.namma.api.enumeration.WalletOwner;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WalletDto {
	private Long id;
    private BigDecimal balance;
    private String paymentToken;
    private Long customer_id;
    private Long driver_id;
    private WalletOwner walletOwner;
}
