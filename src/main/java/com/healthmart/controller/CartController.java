package com.healthmart.controller;

import com.healthmart.entity.*;
import com.healthmart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class CartController {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        try {
            Optional<Cart> cartOpt = cartRepository.findByUserId(userId);
            Map<String, Object> response = new HashMap<>();
            
            if (cartOpt.isEmpty()) {
                response.put("items", new ArrayList<>());
                response.put("totalAmount", 0.0);
                response.put("itemCount", 0);
                return ResponseEntity.ok(response);
            }
            
            Cart cart = cartOpt.get();
            List<Map<String, Object>> itemsList = new ArrayList<>();
            
            for (CartItem item : cart.getItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", item.getId());
                itemMap.put("quantity", item.getQuantity());
                itemMap.put("price", item.getPrice());
                
                Map<String, Object> productMap = new HashMap<>();
                productMap.put("id", item.getProduct().getId());
                productMap.put("name", item.getProduct().getName());
                productMap.put("price", item.getProduct().getPrice());
                productMap.put("image", item.getProduct().getImage());
                productMap.put("brand", item.getProduct().getBrand());
                productMap.put("category", item.getProduct().getCategory());
                
                itemMap.put("product", productMap);
                itemsList.add(itemMap);
            }
            
            response.put("id", cart.getId());
            response.put("items", itemsList);
            response.put("totalAmount", cart.getTotalAmount());
            response.put("itemCount", itemsList.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestParam Long userId, @RequestBody Map<String, Object> request) {
        try {
            Long productId = Long.valueOf(request.get("productId").toString());
            Integer quantity = Integer.valueOf(request.get("quantity").toString());
            
            Cart cart = cartRepository.findByUserId(userId).orElse(null);
            if (cart == null) {
                User user = userRepository.findById(userId).orElseThrow();
                cart = new Cart();
                cart.setUser(user);
                cart.setTotalAmount(0.0);
                cart = cartRepository.save(cart);
            }
            
            Product product = productRepository.findById(productId).orElseThrow();
            
            CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);
            
            if (existingItem != null) {
                existingItem.setQuantity(existingItem.getQuantity() + quantity);
                cartItemRepository.save(existingItem);
            } else {
                CartItem newItem = new CartItem();
                newItem.setCart(cart);
                newItem.setProduct(product);
                newItem.setQuantity(quantity);
                newItem.setPrice(product.getPrice());
                cartItemRepository.save(newItem);
                cart.getItems().add(newItem);
            }
            
            double total = cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
            cart.setTotalAmount(total);
            cartRepository.save(cart);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Product added to cart",
                "cartId", cart.getId(),
                "totalAmount", total
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long cartItemId, @RequestParam Long userId, @RequestBody Map<String, Integer> request) {
        try {
            Integer quantity = request.get("quantity");
            CartItem cartItem = cartItemRepository.findById(cartItemId).orElseThrow();
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
            
            Cart cart = cartRepository.findByUserId(userId).orElseThrow();
            double total = cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
            cart.setTotalAmount(total);
            cartRepository.save(cart);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Quantity updated"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartItemId, @RequestParam Long userId) {
        try {
            cartItemRepository.deleteById(cartItemId);
            Cart cart = cartRepository.findByUserId(userId).orElseThrow();
            double total = cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
            cart.setTotalAmount(total);
            cartRepository.save(cart);
            return ResponseEntity.ok(Map.of("success", true, "message", "Item removed"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}