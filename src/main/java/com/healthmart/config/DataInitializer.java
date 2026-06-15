package com.healthmart.config;

import com.healthmart.entity.User;
import com.healthmart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("========================================");
        System.out.println("Data Initializer Started...");
        System.out.println("========================================");
        
        // Create admin user if not exists
        if (!userRepository.existsByEmail("admin@healthmart.com")) {
            User admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail("admin@healthmart.com");
            admin.setMobileNumber("9999999999");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            admin.setAddress("Admin Office");
            userRepository.save(admin);
            System.out.println("✅ Admin user created!");
            System.out.println("   Email: admin@healthmart.com");
            System.out.println("   Password: admin123");
        }
        
        // Create test user if not exists
        if (!userRepository.existsByEmail("user@healthmart.com")) {
            User user = new User();
            user.setFullName("Test User");
            user.setEmail("user@healthmart.com");
            user.setMobileNumber("8888888888");
            user.setPassword("user123");
            user.setRole("USER");
            user.setAddress("Test Address");
            userRepository.save(user);
            System.out.println("✅ Test user created!");
            System.out.println("   Email: user@healthmart.com");
            System.out.println("   Password: user123");
        }
        
        System.out.println("========================================");
        System.out.println("Data Initializer Completed!");
        System.out.println("========================================");
    }
}