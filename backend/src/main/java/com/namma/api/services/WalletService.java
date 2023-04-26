package com.namma.api.services;

import java.math.BigDecimal;

import com.namma.api.dto.WalletDto;
import com.namma.api.enumeration.WalletOwner;
import com.namma.api.exception.InsufficientFundsException;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.exception.WalletNotFoundException;

public interface WalletService {
	public void addMoney(Long wallerId, BigDecimal amount) throws WalletNotFoundException;
	public void transferMoney(Long sourceWallet_id, Long destinationWallet_id, BigDecimal amount) throws WalletNotFoundException, InsufficientFundsException;
	public WalletDto getWalletById(Long walletId) throws WalletNotFoundException;
}
