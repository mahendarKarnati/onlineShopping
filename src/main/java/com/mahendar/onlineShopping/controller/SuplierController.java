package com.mahendar.onlineShopping.controller;

import org.apache.http.annotation.Contract;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.mahendar.onlineShopping.repo.UserRepository;

@RestController
public class SuplierController {
	@Autowired
	private UserRepository userRepo;

}
