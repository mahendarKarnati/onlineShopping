package com.mahendar.onlineShopping.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mahendar.onlineShopping.model.Booking;
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
	public List<Booking> findByUserId(Long id);
	public List<Booking> findBySuplierId(Long id);
}
