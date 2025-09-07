//package com.mahendar.onlineShopping.config;
//
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig {
//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedOrigins("http://localhost:3000")
//                        .allowedMethods("*")
//                        .allowedHeaders("*")
//                        .allowCredentials(true); // for cookies/session
//            }
//        };
//    }
//}



package com.mahendar.onlineShopping.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//            .allowedOrigins("http://localhost:3000")
//            .allowedMethods("*")
//            .allowCredentials(true)
//            .allowedHeaders("*");
//    }
	
	
	@Override
	public void addCorsMappings(CorsRegistry registry) {
	    registry.addMapping("/**")
	        .allowedOriginPatterns(
	            "http://localhost:3000",
	            "http://192.168.129.133:3000",
//	            "http://192.168.0.100:3000"  ,
	            "http://192.168.1.10:3000",
//	            "http://your-phone-ip:3000",     // if accessing via phone browser
	            "https://online-shopping-neon.vercel.app/" // if using Vercel
	        )
	        .allowedMethods("*")
	        .allowedHeaders("*")
	        .allowCredentials(true);
	}
	
}

