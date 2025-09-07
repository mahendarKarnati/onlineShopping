package com.mahendar.onlineShopping.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mahendar.onlineShopping.model.Cart;
import com.mahendar.onlineShopping.model.Product;
import com.mahendar.onlineShopping.model.User;
import com.mahendar.onlineShopping.repo.CartRepository;
import com.mahendar.onlineShopping.repo.ProductRepository;
import com.mahendar.onlineShopping.repo.UserRepository;
@RequestMapping("/api")
@RestController
public class CartController {
	@Autowired
	private ProductRepository pr;
	@Autowired
	private UserRepository ur;
	@Autowired
	private CartRepository cr;
//	@Autowired
//	private Product product;
//	@PostMapping("/add-to-cart")
//	public Cart addToCart(
////			@RequestParam int quantity,
////			@RequestParam long subTotal,
////			@RequestBody Cart cc
////			@RequestParam long userId,
////			@RequestParam long productId
//			) {
////		User user=ur.findById(userId).get();
////		Product product=pr.findById(productId).get();
////		Cart c=new Cart();
//////		c.setQuantity(cc.getQuantity());
//////		c.setSubTotal(cc.getSubTotal());
////		c.setQuantity(quantity);
////		c.setSubTotal(subTotal);
//		
//		
////		User user=ur.findById(cc.getUser().getId()).get();
////		Product product=pr.findById(cc.getProduct().getId()).get();
//		Cart c= new Cart();
////		c.setQuantity(cc.getQuantity());
////		c.setSubTotal(cc.getSubTotal());
////		c.setQuantity(quantity);
////		c.setSubTotal(subTotal);
////		c.setProduct(product);
////		c.setUser(user);
//		User u=ur.findById(cc.getUser().getId()).orElseThrow(()-> new UsernameNotFoundException("user not found"));
//		Product p=pr.findById(cc.getProduct().getId()).orElseThrow(()-> new UsernameNotFoundException("product not found"));
//		
//					cc.setProduct(p);
//					cc.setUser(u);
//		
//		return cr.save(cc);
//	}
	@GetMapping("/get-cart/{userId}")
	public List<Cart> getCart(@PathVariable Long userId){
		User u=ur.findById(userId).orElseThrow(() -> new RuntimeException("user not found with id: " + userId));
		return cr.findByUser(u);
//		return cr.findByUserId(userId);
		
	}
	@PutMapping("/increment/{id}")
	public String increment(@PathVariable long id) {
		Cart c=cr.findById(id).orElseThrow(() -> new RuntimeException("cart item not found with id: " + id));
		if(c!=null) {
			if(c.getProduct().getStock()>c.getQuantity()) {
			c.setQuantity(c.getQuantity()+1);
			c.setSubTotal(c.getProduct().getPrice()*c.getQuantity());
			cr.save(c);
			Product product=pr.findById(c.getProduct().getId()).orElseThrow(() -> new RuntimeException("Product not found with id: " + c.getProduct().getId()));
			int updatedStock = product.getStock() - 1;
	        product.setStock(updatedStock);
	        pr.save(product);
			}
		}
		return null;
	}
	
	@PutMapping("/decrement/{id}")
	public String decrement(@PathVariable long id) {
		Cart c=cr.findById(id).orElseThrow(() -> new RuntimeException("cart item not found with id: " + id));
		int newQuantity=c.getQuantity()-1;
		if(c!=null) {
			if(newQuantity>0) {
			c.setQuantity(c.getQuantity()-1);
			c.setSubTotal(c.getProduct().getPrice()*c.getQuantity());
			cr.save(c);
			}else {
				cr.deleteById(id);
			}
			
		}
		return null;
	}
	
	@PostMapping("/add-to-cart")
	public Cart addToCart(@RequestBody Map<String, Object> payload) {
	    Long userId = Long.valueOf(payload.get("userId").toString());
	    Long productId = Long.valueOf(payload.get("productId").toString());
	    int quantity = Integer.parseInt(payload.get("quantity").toString());
	    long subTotal = Long.parseLong(payload.get("subTotal").toString());

	    User user = ur.findById(userId)
	            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
	    Product product = pr.findById(productId)
	            .orElseThrow(() -> new RuntimeException("Product not found"));
//	   Cart existCart=cr.findByUserAndProduct(user, product).orElseThrow(() -> new RuntimeException("cart not found with id: " + user));
	    Optional<Cart> existCart=cr.findByUserAndProduct(user, product);
	    if(existCart.isEmpty()) {
//	    	if(product.getStock()>quantity) {
	    Cart c = new Cart();
	    c.setUser(user);
	    c.setProduct(product);
	    c.setQuantity(quantity);   // <-- Don't forget to set
	    c.setSubTotal(subTotal);   // <-- Don't forget to set
	    return cr.save(c);
//	    	}
	    }
	    else {
	    	Cart ex=existCart.get();
	    	if(product.getStock()>existCart.get().getQuantity()) {
	    	ex.setQuantity(ex.getQuantity()+1);
	    	ex.setSubTotal(ex.getQuantity()*ex.getProduct().getPrice());
	    	return cr.save(ex);
	    	}
	    	
	    		return cr.save(ex);

	    }
	}

}
