package com.healthmart.dto;

import com.healthmart.entity.User;

public class RegisterRequest {
    private String fullName;
    private String email;
    private String mobileNumber;
    private String password;
    private String address;
    
    // Default Constructor
    public RegisterRequest() {}
    
    // Parameterized Constructor
    public RegisterRequest(String fullName, String email, String mobileNumber, String password, String address) {
        this.fullName = fullName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.password = password;
        this.address = address;
    }
    
    // Getters
    public String getFullName() {
        return fullName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getMobileNumber() {
        return mobileNumber;
    }
    
    public String getPassword() {
        return password;
    }
    
    public String getAddress() {
        return address;
    }
    
    // Setters
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    // Convert to User entity
    public User toEntity() {
        User user = new User();
        user.setFullName(this.fullName);
        user.setEmail(this.email);
        user.setMobileNumber(this.mobileNumber);
        user.setAddress(this.address);
        user.setPassword(this.password);
        user.setRole("USER"); // Default role
        return user;
    }
    
    @Override
    public String toString() {
        return "RegisterRequest{" +
                "fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", mobileNumber='" + mobileNumber + '\'' +
                ", address='" + address + '\'' +
                '}';
    }
}