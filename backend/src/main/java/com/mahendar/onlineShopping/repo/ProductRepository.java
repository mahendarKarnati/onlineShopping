package com.mahendar.onlineShopping.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mahendar.onlineShopping.model.Product;
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	@Query("SELECT p FROM Product p WHERE p.stock > 0")
	List<Product> findAllAvailableProducts();
	List<Product> findBySuplierId(Long id);
}
