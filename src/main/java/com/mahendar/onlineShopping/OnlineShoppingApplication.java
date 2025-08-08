package com.mahendar.onlineShopping;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

import jakarta.annotation.PostConstruct;

//@SpringBootApplication
//public class OnlineShoppingApplication {
//	public static void main(String[] args) {
//		SpringApplication.run(OnlineShoppingApplication.class, args);
//	}
//
//}

@SpringBootApplication
@ConfigurationPropertiesScan
public class OnlineShoppingApplication {
    public static void main(String[] args) {
        SpringApplication.run(OnlineShoppingApplication.class, args);
        
    }
    @PostConstruct
    public void checkEnvVars() {
        System.out.println("=== ENV VAR CHECK ===");
        System.out.println("DB_NAME: " + System.getenv("DB_NAME"));
        System.out.println("DB_USERNAME: " + System.getenv("DB_USERNAME"));
        System.out.println("DB_PASSWORD: " + (System.getenv("DB_PASSWORD") != null ? "SET" : "NOT SET"));
    }

}

