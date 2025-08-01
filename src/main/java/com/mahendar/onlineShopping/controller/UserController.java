//package com.mahendar.onlineShopping.controller;
//
//import java.util.Optional;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.web.bind.annotation.*;
//
//import com.mahendar.onlineShopping.model.User;
//import com.mahendar.onlineShopping.repo.UserRepository;
//




//@RestController
//@RequestMapping("/api/user")
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
//public class UserController {
//
//    @Autowired
//    private UserRepository userRepo;

//    @GetMapping("/profile")
//    public ResponseEntity<User> getProfile(Authentication authentication) {
//        if (authentication == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        String username = authentication.getName();
//        User user = userRepo.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
//
//        return ResponseEntity.ok(user);
//    }
    
    
//    @GetMapping("/api/user/profile")
//    public ResponseEntity<User> getProfile(Authentication authentication) {
//        String username = authentication.getName();
//        User user = userRepo.findByUsername(username);
//        return ResponseEntity.ok(user);
//    }
//    @GetMapping("/profile")
//    public ResponseEntity<User> getProfile(Authentication authentication) {
//        String username = authentication.getName();
//        User user = userRepo.findByUsername(username)
//                            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
//        System.out.println(userRepo.findByUsername(username));
//        return ResponseEntity.ok(user);
//    }
//
//
//
//    @PutMapping("/update")
//    public ResponseEntity<String> updateUser(@RequestBody User updatedUser, Authentication authentication) {
//        User user = userRepo.findByUsername(authentication.getName())
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        user.setName(updatedUser.getName());
//        user.setEmail(updatedUser.getEmail());
//        userRepo.save(user);
//
//        return ResponseEntity.ok("Updated");
//    }
//}





// === UserController.java ===
package com.mahendar.onlineShopping.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import com.mahendar.onlineShopping.model.User;
import com.mahendar.onlineShopping.repo.UserRepository;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody User updatedUser, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepo.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setMobile(updatedUser.getMobile());
        userRepo.save(user);

        return ResponseEntity.ok("Updated");
    }
}
