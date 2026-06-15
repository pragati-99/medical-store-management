package com.healthmart.dto;

public class LoginResponse {
    private String token;
    private UserDTO user;
    private String message;
    private boolean success;
    
    // Default Constructor
    public LoginResponse() {}
    
    // Parameterized Constructor
    public LoginResponse(String token, UserDTO user, String message) {
        this.token = token;
        this.user = user;
        this.message = message;
        this.success = true;
    }
    
    // Constructor with success flag
    public LoginResponse(String token, UserDTO user, String message, boolean success) {
        this.token = token;
        this.user = user;
        this.message = message;
        this.success = success;
    }
    
    // Getters
    public String getToken() {
        return token;
    }
    
    public UserDTO getUser() {
        return user;
    }
    
    public String getMessage() {
        return message;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    // Setters
    public void setToken(String token) {
        this.token = token;
    }
    
    public void setUser(UserDTO user) {
        this.user = user;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
}