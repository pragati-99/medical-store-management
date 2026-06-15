package com.healthmart.controller;

import com.healthmart.entity.Product;
import com.healthmart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class ProductController {
    
    @Autowired
    private ProductRepository productRepository;
    
    // ========== PUBLIC ENDPOINTS ==========
    
    @GetMapping("/products/public")
    public ResponseEntity<?> getPublicProducts() {
        try {
            System.out.println("=== GET /api/products/public ===");
            List<Product> products = productRepository.findAll();
            System.out.println("Products found: " + products.size());
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/products/category/{category}")
    public ResponseEntity<?> getProductsByCategory(@PathVariable String category) {
        try {
            System.out.println("=== GET /api/products/category/" + category + " ===");
            List<Product> products = productRepository.findByCategory(category);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is working!");
    }
    
    // ========== ADMIN ENDPOINTS (Add, Edit, Delete) ==========
    
    @PostMapping("/admin/products")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            System.out.println("=== ADD PRODUCT ===");
            System.out.println("Name: " + product.getName());
            System.out.println("Category: " + product.getCategory());
            System.out.println("Price: " + product.getPrice());
            
            // Set default values
            if (product.getRating() == null) product.setRating(4.5);
            if (product.getReviews() == null) product.setReviews(0);
            if (product.getInStock() == null) product.setInStock(true);
            if (product.getImage() == null || product.getImage().isEmpty()) {
                product.setImage("https://via.placeholder.com/400x400?text=Product");
            }
            
            Product saved = productRepository.save(product);
            System.out.println("Product added with ID: " + saved.getId());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/admin/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            System.out.println("=== UPDATE PRODUCT ===");
            System.out.println("ID: " + id);
            System.out.println("Name: " + product.getName());
            
            if (!productRepository.existsById(id)) {
                return ResponseEntity.status(404).body(Map.of("error", "Product not found"));
            }
            
            product.setId(id);
            Product updated = productRepository.save(product);
            System.out.println("Product updated successfully");
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/admin/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            System.out.println("=== DELETE PRODUCT ===");
            System.out.println("ID: " + id);
            
            if (!productRepository.existsById(id)) {
                return ResponseEntity.status(404).body(Map.of("error", "Product not found"));
            }
            
            productRepository.deleteById(id);
            System.out.println("Product deleted successfully");
            return ResponseEntity.ok(Map.of("success", true, "message", "Product deleted"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/admin/products")
    public ResponseEntity<?> getAllProductsAdmin() {
        try {
            List<Product> products = productRepository.findAll();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
 // Inventory Management Alerts
    @GetMapping("/products/low-stock")
    public ResponseEntity<?> getLowStockProducts() {
        List<Product> lowStockProducts = productRepository.findByStockQuantityLessThan(10);
        Map<String, Object> response = new HashMap<>();
        response.put("count", lowStockProducts.size());
        response.put("products", lowStockProducts);
        return ResponseEntity.ok(response);
    }
}