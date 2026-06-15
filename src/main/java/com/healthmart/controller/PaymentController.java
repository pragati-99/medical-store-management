package com.healthmart.controller;

import com.healthmart.entity.*;
import com.healthmart.repository.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.razorpay.*;

import java.util.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class PaymentController {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Double amount = Double.valueOf(request.get("amount").toString());
            
            System.out.println("=== Creating Razorpay Order ===");
            System.out.println("User ID: " + userId);
            System.out.println("Amount: " + amount);
            System.out.println("Key ID: " + razorpayKeyId);
            
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int)(amount * 100));
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1);
            
            com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);
            
            System.out.println("Razorpay Order Created: " + razorpayOrder.get("id"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("keyId", razorpayKeyId);
            response.put("orderId", razorpayOrder.get("id"));
            response.put("amount", razorpayOrder.get("amount"));
            response.put("currency", razorpayOrder.get("currency"));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String orderId = request.get("orderId").toString();
            String paymentId = request.get("paymentId").toString();
            System.out.println("=== Verifying Payment ===");
            System.out.println("Order ID: " + orderId);
            System.out.println("Payment ID: " + paymentId);
            
            // Get cart
            Cart cart = cartRepository.findByUserId(userId).orElseThrow();
            
            // Create order in database
            com.healthmart.entity.Order order = new com.healthmart.entity.Order();
            order.setOrderNumber("ORD-" + System.currentTimeMillis());
            order.setUser(userRepository.findById(userId).orElseThrow());
            order.setOrderDate(java.time.LocalDateTime.now());
            order.setTotalAmount(cart.getTotalAmount());
            order.setStatus("CONFIRMED");
            order.setPaymentMethod("RAZORPAY");
            order.setPaymentStatus("COMPLETED");
            order.setShippingAddress("Online Delivery");
            orderRepository.save(order);
            
            // Create order items from cart
            for (CartItem cartItem : cart.getItems()) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(cartItem.getProduct());
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPrice(cartItem.getPrice());
                orderItemRepository.save(orderItem);
                
                // Update stock
                Product product = cartItem.getProduct();
                product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
                productRepository.save(product);
            }
            
            // Clear cart
            cartItemRepository.deleteAll(cart.getItems());
            cart.getItems().clear();
            cart.setTotalAmount(0.0);
            cartRepository.save(cart);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Payment verified successfully"));
            
        } catch (Exception e) {
            System.err.println("Error verifying payment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}