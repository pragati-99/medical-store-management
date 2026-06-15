package com.healthmart.dto;

import com.healthmart.entity.User;

public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String mobileNumber;
    private String role;
    private String address;
    
    // Default Constructor
    public UserDTO() {}
    
    // Constructor from User entity
    public UserDTO(User user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.mobileNumber = user.getMobileNumber();
        this.role = user.getRole();
        this.address = user.getAddress();
    }
    
    // Parameterized Constructor
    public UserDTO(Long id, String fullName, String email, String mobileNumber, String role, String address) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.role = role;
        this.address = address;
    }
    
    // Getters
    public Long getId() {
        return id;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getMobileNumber() {
        return mobileNumber;
    }
    
    public String getRole() {
        return role;
    }
    
    public String getAddress() {
        return address;
    }
    
    // Setters
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    // Convert to User entity
    public User toEntity() {
        User user = new User();
        user.setId(this.id);
        user.setFullName(this.fullName);
        user.setEmail(this.email);
        user.setMobileNumber(this.mobileNumber);
        user.setRole(this.role);
        user.setAddress(this.address);
        return user;
    }
    
    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", mobileNumber='" + mobileNumber + '\'' +
                ", role='" + role + '\'' +
                ", address='" + address + '\'' +
                '}';
    }
}