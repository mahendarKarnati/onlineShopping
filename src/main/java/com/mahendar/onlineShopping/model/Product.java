package com.mahendar.onlineShopping.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double price;
    private String description;
    private int stock;
    private String showcase;
    private String main;
    private String pallu;
    private String blouse;
    private String border;
    private Long suplierId;
    private double mrp;
    private int discount;
        
    public double getMrp() {
		return mrp;
	}
	public void setMrp(double mrp) {
		this.mrp = mrp;
	}
	public int getDiscount() {
		return discount;
	}
	public void setDiscount(int discount) {
		this.discount = discount;
	}
	public Long getSuplierId() {
		return suplierId;
	}
	public void setSuplierId(Long suplierId) {
		this.suplierId = suplierId;
	}
	public String getShowcase() {
		return showcase;
	}
	public void setShowcase(String showcase) {
		this.showcase = showcase;
	}
	public String getMain() {
		return main;
	}
	public void setMain(String main) {
		this.main = main;
	}
	public String getPallu() {
		return pallu;
	}
	public void setPallu(String pallu) {
		this.pallu = pallu;
	}
	public String getBlouse() {
		return blouse;
	}
	public void setBlouse(String blouse) {
		this.blouse = blouse;
	}
	public String getBorder() {
		return border;
	}
	public void setBorder(String border) {
		this.border = border;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getStock() {
		return stock;
	}
	public void setStock(int stock) {
		this.stock = stock;
	}
	

    // Getters and Setters
}
