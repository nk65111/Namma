package com.namma.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.namma.api.entity.Wallet;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {

}
