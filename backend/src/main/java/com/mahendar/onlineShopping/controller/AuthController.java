package com.mahendar.onlineShopping.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cloudinary.http44.api.Response;
import com.mahendar.onlineShopping.model.User;
import com.mahendar.onlineShopping.repo.UserRepository;
import com.mahendar.onlineShopping.service.Email;
import com.mahendar.onlineShopping.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private Email e;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    // ✅ RESTful login endpoint
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestParam Map<String, String> body) {
//        String username = body.get("username");
//        String password = body.get("password");
//
//        try {
//            Authentication auth = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(username, password)
//            );
//            SecurityContextHolder.getContext().setAuthentication(auth);
//            System.out.println(auth);
////            return ResponseEntity.ok(Map.of("message", "Login successful", "username", username));
//            String jwtToken = jwtUtil.generateToken(username);
//            return ResponseEntity.ok(Map.of(
//            	    "message", "Login successful",
//            	    "username", username,
//            	    
//            	    "token", jwtToken  // <-- Make sure this exists
//            	));
//
//        } catch (Exception ex) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
//        }
//    }
    
    
    
    
    
    
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
//        Long userId;

        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            // 👇 Get User object from authentication
            UserDetails userDetails = (UserDetails) auth.getPrincipal();

            // 🔎 Fetch full User entity from DB (to get ID, role, etc.)
            User user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            if((user.getRole()).equals("ROLE_PENDING_SUPPLIER")) {
return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
                
                
            }
            else {
            	Long userId=user.getId();
                // 🔐 Generate JWT token
                String jwtToken = jwtUtil.generateToken(username,userId,user.getRole(),user.getName());

                // ✅ Return token + user info
                return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", jwtToken,
                    "user", Map.of(
                        "id", userId,
                        "username", user.getUsername(),
                        "role", user.getRole(),
                        "name",user.getName()
                    )
                ));
            }

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    
    
    
    
    
    
    
    
    
    
    

    // ✅ Register endpoint
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists");
        }
        System.out.println("== Incoming user ==");
        System.out.println("Name: " + user.getName());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Username: " + user.getUsername());
        System.out.println("Mobile: " + user.getMobile());
        System.out.println("Role: " + user.getRole());


        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if((user.getRole()).equals("ROLE_USER")){
        user.setRole("ROLE_USER");
        e.sendEmail(user.getEmail(), "account created", ("hello "+user.getName()+" your account created successfully. you can login in our website. thank you have a nice day"));
        
        }
        else {
        	user.setRole("ROLE_PENDING_SUPPLIER");
        	e.sendEmail(user.getEmail(), "account creation ", ("hello "+user.getName()+" we recieved your request. we will review your application and will give update soon. thank you have a nice day."));
        	
        }
        System.out.println("mobile: "+user.getMobile());
        userRepo.save(user);
        return ResponseEntity.ok("Registered");
    }
    
    
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        // Invalidate session
        request.getSession().invalidate();

        // Clear Spring Security context
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("Logged out successfully");
    }
    
    
    
    
    @PostMapping("/forget")
    public ResponseEntity<String> forgetPassword(@RequestBody User request) {
        String email = request.getEmail();
        Long mobile = request.getMobile();

        Optional<User> userOpt = userRepo.findByEmailAndMobile(email, mobile);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok("User verified. Proceed to reset.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }


        // 2. Reset password
        @PostMapping("/reset")
        public ResponseEntity<String> resetPassword(@RequestBody User payload) {
            Optional<User> userOpt = userRepo.findByEmail(payload.getEmail());
            if (userOpt.isPresent()) {
            	System.out.println("password: "+payload.getPassword());
                User user = userOpt.get();
                user.setPassword(passwordEncoder.encode(payload.getPassword()));
                userRepo.save(user);
                e.sendEmail(user.getEmail(), "password reset" , "hello "+user.getName()+" your password was successfully reset. thanky you have a nice day");
                return ResponseEntity.ok("Password reset successful");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
            }
        }  
}
