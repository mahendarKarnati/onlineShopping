package com.mahendar.onlineShopping.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mahendar.onlineShopping.model.Booking;
import com.mahendar.onlineShopping.model.Product;
import com.mahendar.onlineShopping.repo.BookingRepository;
import com.mahendar.onlineShopping.repo.ProductRepository;

@Service
public class BookingService {
	LocalDate today=LocalDate.now();

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ProductRepository productRepository;

    public Booking createBooking(Booking booking) {
        Product product = productRepository.findById(booking.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        System.out.println("Booking quantity: " + booking.getQuantity());
        System.out.println("Product stock: " + product.getStock());

        if (booking.getQuantity() > product.getStock()) {
            throw new RuntimeException("Not enough stock available");
        }

        int updatedStock = product.getStock() - booking.getQuantity();
        product.setStock(updatedStock);
        productRepository.save(product);
        booking.setBookingDate(today);
        return bookingRepository.save(booking);
    }
   
}

