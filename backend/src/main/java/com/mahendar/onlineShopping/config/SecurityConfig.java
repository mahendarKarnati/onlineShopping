////package com.mahendar.onlineShopping.config;
////
////import jakarta.servlet.http.HttpServletResponse;
////import org.springframework.context.annotation.Bean;
////import org.springframework.context.annotation.Configuration;
////import org.springframework.security.authentication.AuthenticationManager;
////import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
////import org.springframework.security.config.annotation.web.builders.HttpSecurity;
////import org.springframework.security.config.http.SessionCreationPolicy;
////import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
////import org.springframework.security.crypto.password.PasswordEncoder;
////import org.springframework.security.web.SecurityFilterChain;
////import org.springframework.web.cors.CorsConfiguration;
////import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
////import org.springframework.web.filter.CorsFilter;
////
////@Configuration
////public class SecurityConfig {
////
////    @Bean
////    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
////        http
////            .csrf(csrf -> csrf.disable())
////            .cors(cors -> {}) // Enable CORS using the corsFilter bean
////
////            .authorizeHttpRequests(auth -> auth
////                .requestMatchers("/api/auth/**", "/api/products/get").permitAll()
////                .anyRequest().authenticated()
////            )
////
////            .sessionManagement(session -> session
////                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Optional: use if you're going stateless
////            )
////
////            .exceptionHandling(ex -> ex
////                .authenticationEntryPoint((request, response, authException) -> {
////                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
////                    response.getWriter().write("Unauthorized");
////                })
////            )
////
////            .formLogin(form -> form.disable()); // ✅ Disable Spring's built-in login page
////
////        return http.build();
//    	
//    	
//    	
////    	http
////        .csrf(csrf -> csrf.disable())
////        .authorizeHttpRequests(auth -> auth
////        		.requestMatchers("/api/**").permitAll()
////            .anyRequest().authenticated()
////        )
////        .formLogin(form -> form
////            .loginProcessingUrl("/api/auth/login")
////            .permitAll()
////        )
////        
////        .logout(logout -> logout
////            .logoutUrl("/logout")
////            .logoutSuccessUrl("/login")
////            .permitAll()
////        );
////
////    	 return http.build();
////    }
////
////    @Bean
////    public PasswordEncoder passwordEncoder() {
////        return new BCryptPasswordEncoder();
////    }
////
////    @Bean
////    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
////        return config.getAuthenticationManager();
////    }
////
////    @Bean
////    public CorsFilter corsFilter() {
////        CorsConfiguration config = new CorsConfiguration();
////        config.setAllowCredentials(true);
////        config.addAllowedOrigin("http://localhost:3000");
////        config.addAllowedHeader("*");
////        config.addAllowedMethod("*");
////
////        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
////        source.registerCorsConfiguration("/**", config);
////        return new CorsFilter(source);
////    }
////}
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
////
//package com.mahendar.onlineShopping.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import com.mahendar.onlineShopping.security.JwtAuthenticationFilter;
//import com.mahendar.onlineShopping.service.MyUserDetailsService;
//import com.mahendar.onlineShopping.util.JwtUtil;
//
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//@Configuration
//public class SecurityConfig {
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//    @Autowired
//    private JwtUtil jwtUtil;
//    @Autowired
//    private MyUserDetailsService userDetailsService;
//
//    // Expose AuthenticationManager as a Bean
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//        return config.getAuthenticationManager();
//    }
//    
//    
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//            .cors().and()
//            .csrf().disable()
//            .authorizeHttpRequests(auth -> auth
//                .requestMatchers("/api/**").permitAll()
//                .anyRequest().authenticated()
//            )
//            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//            .formLogin().disable()
//            .httpBasic().disable();
//
//        http.addFilterBefore(new JwtAuthenticationFilter(jwtUtil, userDetailsService), UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//
//}
//
//
//








package com.mahendar.onlineShopping.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.mahendar.onlineShopping.security.JwtAuthenticationFilter;
import com.mahendar.onlineShopping.util.JwtUtil;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtUtil, userDetailsService);

        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://192.168.129.133:3000");
        config.addAllowedOrigin("http://192.168.1.10:3000");
//        config.addAllowedOriginPattern("http://localhost:3000","http://192.168.129.133:3000");
//        config.
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.addExposedHeader("Authorization");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
    
    
//    protected void configure(HttpSecurity http) throws Exception {
//        http.cors().and()
//            .csrf().disable()
//            .authorizeRequests()
//            .anyRequest().permitAll();
//    }

}

