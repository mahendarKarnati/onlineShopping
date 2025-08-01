package com.mahendar.onlineShopping.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import com.cloudinary.http44.api.Response;
import com.mahendar.onlineShopping.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByUsername(String username);
	List<User> findByRole(String role);
//	public Optional<User> findByEmailAndMobile(String email,Long mobile);
	
	
	Optional<User> findByEmailAndMobile(String email, Long mobile);
    Optional<User> findByEmail(String email);

}
