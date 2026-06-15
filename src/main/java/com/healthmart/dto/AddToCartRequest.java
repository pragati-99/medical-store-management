package com.healthmart.dto;

public class AddToCartRequest {
    private Long productId;
    private Integer quantity;
    
    // Default Constructor
    public AddToCartRequest() {
        this.quantity = 1; // Default quantity
    }
    
    // Parameterized Constructor
    public AddToCartRequest(Long productId, Integer quantity) {
        this.productId = productId;
        this.quantity = quantity != null ? quantity : 1;
    }
    
    // Getters
    public Long getProductId() {
        return productId;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    // Setters
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    @Override
    public String toString() {
        return "AddToCartRequest{" +
                "productId=" + productId +
                ", quantity=" + quantity +
                '}';
    }
}