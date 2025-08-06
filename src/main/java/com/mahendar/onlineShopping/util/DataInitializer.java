package com.mahendar.onlineShopping.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.mahendar.onlineShopping.model.User;
import com.mahendar.onlineShopping.repo.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin@123")) {
            User admin = new User();
            admin.setUsername("admin@123");
            admin.setPassword(passwordEncoder.encode("admin@123"));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            System.out.println("Admin user created.");
        }
    }
}

