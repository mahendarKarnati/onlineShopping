package com.mahendar.onlineShopping.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dkvvq7sdp");
        config.put("api_key", "576736224996614");
        config.put("api_secret", "1xmzftZs_2JChiD5CDU-DTU6rSA");
        return new Cloudinary(config);
    }
}
