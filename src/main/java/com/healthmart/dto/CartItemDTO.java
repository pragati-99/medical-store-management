package com.healthmart.dto;

import com.healthmart.entity.CartItem;

public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Double productPrice;
    private Integer quantity;
    private Double totalPrice;
    
    // Default Constructor
    public CartItemDTO() {}
    
    // Constructor from CartItem entity
    public CartItemDTO(CartItem cartItem) {
        this.id = cartItem.getId();
        this.productId = cartItem.getProduct().getId();
        this.productName = cartItem.getProduct().getName();
        this.productPrice = cartItem.getPrice();
        this.quantity = cartItem.getQuantity();
        this.totalPrice = cartItem.getPrice() * cartItem.getQuantity();
    }
    
    // Getters
    public Long getId() {
        return id;
    }
    
    public Long getProductId() {
        return productId;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public Double getProductPrice() {
        return productPrice;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public Double getTotalPrice() {
        return totalPrice;
    }
    
    // Setters
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    public void setProductName(String productName) {
        this.productName = productName;
    }
    
    public void setProductPrice(Double productPrice) {
        this.productPrice = productPrice;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
}