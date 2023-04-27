package com.namma.api.services;

import java.math.BigDecimal;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.namma.api.dto.WalletDto;
import com.namma.api.entity.Customer;
import com.namma.api.entity.Driver;
import com.namma.api.entity.Wallet;
import com.namma.api.enumeration.WalletOwner;
import com.namma.api.exception.InsufficientFundsException;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.exception.WalletNotFoundException;
import com.namma.api.repository.CustomerRepository;
import com.namma.api.repository.DriverRepository;
import com.namma.api.repository.WalletRepository;

@Service
@Transactional
public class WalletServiceImpl implements WalletService {
	
	@Autowired
	private WalletRepository walletRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private DriverRepository driverRepository;

    @Override
    public void addMoney(Long wallerId, BigDecimal amount) throws WalletNotFoundException {
    	Wallet wallet = walletRepository.findById(wallerId)
				.orElseThrow(() -> new WalletNotFoundException("Wallet not found"));
    	
    	BigDecimal totalAmount = wallet.getBalance().add(amount);
    	
    	wallet.setBalance(totalAmount);
    	
    	walletRepository.save(wallet);
    }

    @Override
	public void transferMoney(Long sourceWallet_id, Long destinationWallet_id, BigDecimal amount) throws WalletNotFoundException, InsufficientFundsException {
		Optional<Wallet> optional_source_wallet = walletRepository.findById(destinationWallet_id);
		Wallet source_wallet = optional_source_wallet.orElseThrow(() -> new WalletNotFoundException("Customer wallet not found"));
		
		Optional<Wallet> optional_des_wallet = walletRepository.findById(destinationWallet_id);
		Wallet des_wallet = optional_des_wallet.orElseThrow(() -> new WalletNotFoundException("Driver wallet not found"));
		
		if(source_wallet.getBalance().compareTo(amount) == -1) {
			throw new InsufficientFundsException("Not sufficient amount available for transfer");
		}
		
		source_wallet.setBalance(source_wallet.getBalance().subtract(amount));
		des_wallet.setBalance(des_wallet.getBalance().add(amount));
		
		walletRepository.save(source_wallet);
		walletRepository.save(des_wallet);
	}
	
	@Override
	public WalletDto getWalletById(Long walletId) throws WalletNotFoundException {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new WalletNotFoundException("Wallet not found with ID " + walletId));
        
        WalletDto walletDto = new WalletDto();
        walletDto.setBalance(wallet.getBalance());
        walletDto.setId(wallet.getId());
        walletDto.setPaymentToken(wallet.getPaymentToken());
        walletDto.setWalletOwner(wallet.getWalletOwner());
        
        return walletDto;
    }
}
