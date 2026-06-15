package com.healthmart.controller;

import com.healthmart.entity.User;
import com.healthmart.repository.UserRepository;
import com.healthmart.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }
        
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());
        user.setPassword(request.getPassword()); // Plain password
        user.setRole("USER");
        user.setAddress(request.getAddress());
        
        User savedUser = userRepository.save(user);
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Registration successful",
            "userId", savedUser.getId()
        ));
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }
        
        // Plain password comparison
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid password"));
        }
        
        String token = UUID.randomUUID().toString();
        UserDTO userDTO = new UserDTO(user);
        
        return ResponseEntity.ok(new LoginResponse(token, userDTO, "Login successful"));
    }
}