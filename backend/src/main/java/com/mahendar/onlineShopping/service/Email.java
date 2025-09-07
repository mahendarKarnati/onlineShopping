package com.mahendar.onlineShopping.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service
public class Email {
	@Autowired
private JavaMailSender mailSender;
	public void sendEmail(String toEmail,String subject,String body) {
		SimpleMailMessage msg=new SimpleMailMessage();
		msg.setFrom("mahendarkaruati@gmail.com");
		msg.setTo(toEmail);
		msg.setText(body);
		msg.setSubject(subject);
		mailSender.send(msg);
		System.out.println("mail send successfully");
	}
}
