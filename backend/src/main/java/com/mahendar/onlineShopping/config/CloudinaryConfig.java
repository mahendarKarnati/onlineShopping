package com.mahendar.onlineShopping.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudinaryConfig {
    
    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
//        config.put("cloud_name", System.getenv("CLOUDINARY_CLOUD_NAME"));
//        config.put("api_key", System.getenv("CLOUDINARY_API_KEY"));
//        config.put("api_secret", System.getenv("CLOUDINARY_API_SECRET"));
        
        
        config.put("cloud_name", "dkvvq7sdp");
        config.put("api_key", "576736224996614");
        config.put("api_secret", "1xmzftZs_2JChiD5CDU-DTU6rSA");
        return new Cloudinary(config);
    }
}
