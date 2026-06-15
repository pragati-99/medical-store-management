package com.healthmart.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String shortName;
    private String category;
    private Double price;
    private Double originalPrice;
    
    @Column(length = 1000)
    private String image;
    
    @Column(length = 1000)
    private String hoverImage;
    
    private Double rating = 4.5;
    private Integer reviews = 0;
    private String tag;
    private String badgeColor;
    private Integer discount;
    private Boolean inStock = true;
    private String brand;
    
    @Column(length = 2000)
    private String description;
    
    private Integer stockQuantity = 100;
    
    // Default Constructor
    public Product() {}
    
    // Parameterized Constructor
    public Product(String name, String category, Double price, String brand) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.brand = brand;
        this.inStock = true;
        this.stockQuantity = 100;
        this.rating = 4.5;
        this.reviews = 0;
    }
    
    // ========== Getters and Setters ==========
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getShortName() { return shortName; }
    public void setShortName(String shortName) { this.shortName = shortName; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    
    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public String getHoverImage() { return hoverImage; }
    public void setHoverImage(String hoverImage) { this.hoverImage = hoverImage; }
    
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    
    public Integer getReviews() { return reviews; }
    public void setReviews(Integer reviews) { this.reviews = reviews; }
    
    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }
    
    public String getBadgeColor() { return badgeColor; }
    public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }
    
    public Integer getDiscount() { return discount; }
    public void setDiscount(Integer discount) { this.discount = discount; }
    
    // FIXED: Simple getter for inStock
    public Boolean getInStock() { 
        return inStock;
    }
    
    public void setInStock(Boolean inStock) { 
        this.inStock = inStock; 
    }
    
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { 
        this.stockQuantity = stockQuantity;
        if (stockQuantity != null && stockQuantity > 0) {
            this.inStock = true;
        } else {
            this.inStock = false;
        }
    }
    
    // ========== Helper Methods (Optional for frontend) ==========
    
    @JsonIgnore
    public boolean hasDiscount() {
        return discount != null && discount > 0;
    }
    
    public double getDiscountedPrice() {
        if (hasDiscount()) {
            return price - (price * discount / 100);
        }
        return price;
    }
    
    public int getDiscountPercentage() {
        return discount != null ? discount : 0;
    }
    
    public String getFormattedPrice() {
        return String.format("₹%.2f", price);
    }
    
    public String getFormattedDiscountedPrice() {
        return String.format("₹%.2f", getDiscountedPrice());
    }
    
    @JsonIgnore
    public boolean isLowStock() {
        return stockQuantity != null && stockQuantity < 10 && stockQuantity > 0;
    }
    
    public String getStockStatus() {
        if (stockQuantity == null || stockQuantity <= 0) {
            return "Out of Stock";
        } else if (stockQuantity < 10) {
            return "Only " + stockQuantity + " left!";
        } else {
            return "In Stock";
        }
    }
    
    public int getRatingStars() {
        return rating != null ? rating.intValue() : 4;
    }
    
    public boolean isNewProduct() {
        return tag != null && tag.equalsIgnoreCase("New");
    }
    
    public boolean isBestSeller() {
        return tag != null && tag.equalsIgnoreCase("Best Seller");
    }
    
    public void reduceStock(int quantity) {
        if (stockQuantity != null && stockQuantity >= quantity) {
            stockQuantity -= quantity;
            if (stockQuantity == 0) {
                inStock = false;
            }
        }
    }
    
    public void increaseStock(int quantity) {
        if (stockQuantity != null) {
            stockQuantity += quantity;
            if (stockQuantity > 0) {
                inStock = true;
            }
        }
    }
    
    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", price=" + price +
                ", brand='" + brand + '\'' +
                ", inStock=" + inStock +
                '}';
    }
}