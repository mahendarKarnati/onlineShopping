package com.mahendar.onlineShopping.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mahendar.onlineShopping.model.Cart;
import com.mahendar.onlineShopping.model.Product;
import com.mahendar.onlineShopping.model.User;
@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
	public List<Cart> findByUser(User u);
	public Optional<Cart> findByUserAndProduct(User u,Product p);
	public Cart findByProduct(Product p);
}
