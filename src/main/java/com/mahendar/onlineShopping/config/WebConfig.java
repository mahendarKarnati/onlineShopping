
package com.mahendar.onlineShopping.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {	
	@Override
	public void addCorsMappings(CorsRegistry registry) {
	    registry.addMapping("/**")
	        .allowedOriginPatterns(
	        "https://onlineshopping-omega.vercel.app",
			"http://localhost:*"
	        )
	        .allowedMethods("*")
	        .allowedHeaders("*")
	        .allowCredentials(true);
	}	
}

