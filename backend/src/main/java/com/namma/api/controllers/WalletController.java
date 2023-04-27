package com.namma.api.controllers;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.namma.api.dto.WalletDto;
import com.namma.api.enumeration.WalletOwner;
import com.namma.api.exception.InsufficientFundsException;
import com.namma.api.exception.ResourceNotFoundException;
import com.namma.api.exception.WalletNotFoundException;
import com.namma.api.services.WalletService;

@RestController
@RequestMapping("/api/v1/wallet")
public class WalletController {
	
	@Autowired
    private WalletService walletService;

    @PostMapping("/add/{wallerId}")
    public ResponseEntity<String> addMoney(@PathVariable Long wallerId, @RequestBody BigDecimal amount) throws WalletNotFoundException {
        walletService.addMoney( wallerId, amount);
        return new ResponseEntity<String>("Add money to wallet successfully", HttpStatus.OK);
    }

    @PutMapping("/transfer/{sourceWallet_id}/{destinationWallet_id}")
    public ResponseEntity<String> deductMoney(@PathVariable Long sourceWallet_id, @PathVariable Long destinationWallet_id, @RequestBody BigDecimal amount ) throws InsufficientFundsException, WalletNotFoundException {
        walletService.transferMoney(sourceWallet_id, destinationWallet_id, amount);
        return new ResponseEntity<String>("Money transfer to driver wallet successfully", HttpStatus.OK);
    } 
    
    @GetMapping("/my-wallet")
    public ResponseEntity<WalletDto> getWalletById(@RequestParam Long userId) throws WalletNotFoundException  {
    	WalletDto balance =  walletService.getWalletById(userId);
        return new ResponseEntity<WalletDto>(balance, HttpStatus.OK);
        
    }
}

