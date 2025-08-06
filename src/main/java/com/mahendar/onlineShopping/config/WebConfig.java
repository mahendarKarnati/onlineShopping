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
<<<<<<< HEAD
	            // "http://localhost:3000",
	            // "http://192.168.129.133:3000",
//	            "http://192.168.0.100:3000"  ,  // if needed
//	            "http://your-phone-ip:3000",     // if accessing via phone browser
	            "https://online-shopping-neon.vercel.app" // if using Vercel
=======
	        "https://onlineshopping-omega.vercel.app" // if using Vercel
>>>>>>> fe9c5a331f9181e10f1cf76b1c03d8450265234e
	        )
	        .allowedMethods("*")
	        .allowedHeaders("*")
	        .allowCredentials(true);
	}

	
	
	
	
	
}

