package com.mahendar.onlineShopping.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mahendar.onlineShopping.model.User;
import com.mahendar.onlineShopping.repo.UserRepository;
import com.mahendar.onlineShopping.service.Email;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
	@Autowired
	private Email e;
	@Autowired
	private UserRepository userRepo;
	@GetMapping("/users")
	public List<User> getAllUsers(){
		return userRepo.findByRole("ROLE_USER");
	}
	@GetMapping("/suppliers")
	public List<User> getAllSuppliers(){
		return userRepo.findByRole("ROLE_SUPPLIER");
	}
	
	 @GetMapping("/pendingRequests")
	    public List<User> getSupplierRoleRequest(){
		 System.out.println("pending data: "+userRepo.findByRole("ROLE_PENDING_SUPPLIER"));
	    	return userRepo.findByRole("ROLE_PENDING_SUPPLIER");
	    }
	    @PutMapping("/accept/{id}")
	    public ResponseEntity<String> accept(@PathVariable Long id){
	    	User u=userRepo.findById(id).orElseThrow();
	    	u.setRole("ROLE_SUPPLIER");
	    	userRepo.save(u);
	    	e.sendEmail(u.getEmail(), "update role request", ("hello, "+u.getName()+" your role request is accepted. Now you are Supplier to my bussiness. you can upload your products in my website. thank you."));
			return ResponseEntity.ok("request accepted successfully");
	    	
	    }
	    @DeleteMapping("/reject/{id}")
	    public ResponseEntity<String> deleteRequest(@PathVariable Long id){
	    	User u=userRepo.findById(id).orElseThrow();
	       	e.sendEmail(u.getEmail(), "update role request", ("hello, "+u.getName()+" your role request is Reject.sorry. thank you."));
	    	userRepo.deleteById(id);
			return ResponseEntity.ok("request rejected successfully");
	    	
	    }
}	
