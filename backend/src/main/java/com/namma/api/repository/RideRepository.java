package com.namma.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.namma.api.entity.Customer;
import com.namma.api.entity.Driver;
import com.namma.api.entity.Ride;

public interface RideRepository extends JpaRepository<Ride, Long>{
   Optional<Ride> findByCustomerAndDateAndIsReturn(Customer customer,String Date,Boolean isReturn);
   
   List<Ride> findByCustomerAndIsCompleted(Customer customer,Boolean isCompleted);
   
   List<Ride> findByDriverAndIsCompleted(Driver driver,Boolean isCOmpleted);
   
   Optional<Ride> findByCustomerAndDate(Customer customer,String date);
   
   List<Ride> findByCustomerAndIsCompletedOrderByDateAsc(Customer customer,Boolean isCompleted);

}
