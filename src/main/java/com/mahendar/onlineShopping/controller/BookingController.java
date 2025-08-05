package com.mahendar.onlineShopping.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mahendar.onlineShopping.model.Booking;
import com.mahendar.onlineShopping.repo.BookingRepository;
import com.mahendar.onlineShopping.repo.UserRepository;
import com.mahendar.onlineShopping.service.BookingService;
import com.mahendar.onlineShopping.service.Email;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingService bookingService;
    @Autowired
    private Email e;
    @Autowired
    private BookingRepository bookingRepo;

    @PostMapping("/create")
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }
    
    @GetMapping("/{id}")
    public List<Booking> getBookings(@PathVariable Long id){
    	System.out.println(bookingRepo.findByUserId(id));
		return bookingRepo.findByUserId(id);
    	
    }
    @GetMapping("/supplier/{id}")
    public List<Booking> getOrders(@PathVariable Long id){
    	System.out.println(bookingRepo.findBySuplierId(id));
		return bookingRepo.findBySuplierId(id);
    	
    }
    
    @PutMapping("/supplier/updates/{id}")
    public ResponseEntity<String> updateBooking(
        @PathVariable Long id,
        @RequestBody Map<String, String> updates
    ) {
        Booking booking = bookingRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (updates.containsKey("deliveredDate")) {
            booking.setDeliveredDate(updates.get("deliveredDate"));
        }
        if (updates.containsKey("bookingStatus")) {
            booking.setBookingStatus(updates.get("bookingStatus"));
        }
        if (updates.containsKey("status")) {
            booking.setStatus(updates.get("status"));
        }

        bookingRepo.save(booking);
        return ResponseEntity.ok("Booking updated successfully");
    }


}
