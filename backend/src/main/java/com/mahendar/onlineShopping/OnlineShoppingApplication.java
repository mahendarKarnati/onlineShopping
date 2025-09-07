package com.mahendar.onlineShopping;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class OnlineShoppingApplication {
    public static void main(String[] args) {
        SpringApplication.run(OnlineShoppingApplication.class, args);
    }
}

