package com.healthmart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HealthMartApplication {
    public static void main(String[] args) {
        SpringApplication.run(HealthMartApplication.class, args);
        System.out.println("========================================");
        System.out.println("HealthMart Backend Server Started!");
        System.out.println("Server URL: http://localhost:8080");
        System.out.println("========================================");
    }
}