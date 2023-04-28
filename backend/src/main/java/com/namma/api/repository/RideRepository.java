package com.namma.api.repository;



import java.time.Instant;
import java.time.LocalTime;
import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.namma.api.entity.Customer;
import com.namma.api.entity.Driver;
import com.namma.api.entity.Ride;

public interface RideRepository extends JpaRepository<Ride, Long>{
   
   List<Ride> findByCustomerOrderByDateAsc(Customer customer);
   
   List<Ride> findByDriverOrderByDateDesc(Driver driver);
   
   @Query(value = "Select * from rides where customer_id=?1 and date >=CURRENT_DATE and pickup_time_first>=CURRENT_TIME and status='PENDING' order by date,pickup_time_first asc",nativeQuery = true)
   List<Ride> findRidesByDateAndTimeWithCutomer(Long custId);
   
   @Query(value="SELECT * FROM rides WHERE pickup_time_first >=?1 and pickup_time_first <=?2 and Date(date)=Date(?3) and customer_id=?4 and status='PENDING'",nativeQuery = true)
   List<Ride> findRidesByDateAndTime(LocalTime to,LocalTime from,Instant date,Long custId);

}
