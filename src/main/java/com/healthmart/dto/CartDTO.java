package com.healthmart.dto;

import com.healthmart.entity.Cart;
import java.util.List;
import java.util.stream.Collectors;

public class CartDTO {
    private Long id;
    private Long userId;
    private List<CartItemDTO> items;
    private Double totalAmount;
    private int itemCount;
    
    // Default Constructor
    public CartDTO() {}
    
    // Constructor from Cart entity
    public CartDTO(Cart cart) {
        this.id = cart.getId();
        this.userId = cart.getUser() != null ? cart.getUser().getId() : null;
        this.items = cart.getItems().stream()
                .map(CartItemDTO::new)
                .collect(Collectors.toList());
        this.totalAmount = cart.getTotalAmount();
        this.itemCount = cart.getItems().size();
    }
    
    // Getters
    public Long getId() {
        return id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public List<CartItemDTO> getItems() {
        return items;
    }
    
    public Double getTotalAmount() {
        return totalAmount;
    }
    
    public int getItemCount() {
        return itemCount;
    }
    
    // Setters
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public void setItems(List<CartItemDTO> items) {
        this.items = items;
    }
    
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public void setItemCount(int itemCount) {
        this.itemCount = itemCount;
    }
}