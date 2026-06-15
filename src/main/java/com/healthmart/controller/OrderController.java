package com.healthmart.controller;

import com.healthmart.entity.*;
import com.healthmart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            
            Cart cart = cartRepository.findByUserId(userId).orElse(null);
            if (cart == null || cart.getItems().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Cart is empty"));
            }
            
            User user = userRepository.findById(userId).orElse(null);
            
            // Create order
            Order order = new Order();
            order.setOrderNumber("ORD-" + System.currentTimeMillis());
            order.setUser(user);
            order.setOrderDate(LocalDateTime.now());
            order.setTotalAmount(cart.getTotalAmount());
            order.setStatus("CONFIRMED");
            order.setPaymentMethod("COD");
            
            // Customer details
            String customerName = request.containsKey("customerName") ? 
                request.get("customerName").toString() : (user != null ? user.getFullName() : "Guest");
            order.setCustomerName(customerName);
            
            String customerEmail = request.containsKey("email") ? 
                request.get("email").toString() : (user != null ? user.getEmail() : "");
            order.setCustomerEmail(customerEmail);
            
            String customerPhone = request.containsKey("phone") ? 
                request.get("phone").toString() : (user != null ? user.getMobileNumber() : "");
            order.setCustomerPhone(customerPhone);
            
            //  Address - 
            String address = request.containsKey("address") && request.get("address") != null 
                && !request.get("address").toString().trim().isEmpty() 
                ? request.get("address").toString() : "Online Delivery";
            order.setShippingAddress(address);
            
            order = orderRepository.save(order);
            
            // Save order items and update stock
            for (CartItem cartItem : cart.getItems()) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(cartItem.getProduct());
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPrice(cartItem.getPrice());
                orderItemRepository.save(orderItem);
                
                Product product = cartItem.getProduct();
                product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
                productRepository.save(product);
            }
            
            // Clear cart
            cart.getItems().clear();
            cart.setTotalAmount(0.0);
            cartRepository.save(cart);
            
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "orderNumber", order.getOrderNumber(),
                "message", "Order placed successfully"
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    // ==================== GET USER ORDERS ====================
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
        try {
            List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
            
            List<Map<String, Object>> orderList = new ArrayList<>();
            for (Order order : orders) {
                Map<String, Object> orderData = new HashMap<>();
                orderData.put("id", order.getId());
                orderData.put("orderNumber", order.getOrderNumber());
                orderData.put("orderDate", order.getOrderDate());
                orderData.put("totalAmount", order.getTotalAmount());
                orderData.put("status", order.getStatus());
                orderData.put("paymentMethod", order.getPaymentMethod());
                orderData.put("customerName", order.getCustomerName());
                orderData.put("customerEmail", order.getCustomerEmail());
                orderData.put("customerPhone", order.getCustomerPhone());
                
                // ✅ Get Order Items
                List<Map<String, Object>> itemsList = new ArrayList<>();
                if (order.getItems() != null && !order.getItems().isEmpty()) {
                    for (OrderItem item : order.getItems()) {
                        Map<String, Object> itemData = new HashMap<>();
                        itemData.put("id", item.getId());
                        itemData.put("productName", item.getProduct() != null ? item.getProduct().getName() : "Product");
                        itemData.put("quantity", item.getQuantity());
                        itemData.put("price", item.getPrice());
                        itemData.put("total", item.getQuantity() * item.getPrice());
                        itemData.put("productImage", item.getProduct() != null ? item.getProduct().getImage() : null);
                        itemsList.add(itemData);
                    }
                }
                orderData.put("items", itemsList);
                
                orderList.add(orderData);
            }
            
            return ResponseEntity.ok(orderList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
 // ==================== DELETE ORDER ====================
    @DeleteMapping("/user/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId) {
        try {
            Order order = orderRepository.findById(orderId).orElse(null);
            if (order == null) {
                return ResponseEntity.status(404).body(Map.of("success", false, "message", "Order not found"));
            }
            
            // Only allow if order is CANCELLED or DELIVERED
            if (!order.getStatus().equals("CANCELLED") && !order.getStatus().equals("DELIVERED")) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Only cancelled or delivered orders can be deleted"));
            }
            
            // Delete order items first
            orderItemRepository.deleteAll(order.getItems());
            
            // Delete order
            orderRepository.delete(order);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Order deleted successfully"));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    // ==================== GET ALL ORDERS FOR ADMIN ====================
    @GetMapping("/admin/all")
    public List<Map<String, Object>> getAllOrders() {
        List<Order> orders = orderRepository.findAllOrdersAscending();
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Order order : orders) {
            Map<String, Object> o = new HashMap<>();
            o.put("id", order.getId());
            o.put("orderNumber", order.getOrderNumber());
            o.put("orderDate", order.getOrderDate());
            o.put("totalAmount", order.getTotalAmount());
            o.put("status", order.getStatus());
            o.put("paymentMethod", order.getPaymentMethod());
            
            String name = order.getCustomerName();
            if (name == null || name.isEmpty()) {
                if (order.getUser() != null) {
                    name = order.getUser().getFullName();
                }
                if (name == null || name.isEmpty()) {
                    name = "Guest";
                }
            }
            o.put("customerName", name);
            
            result.add(o);
        }
        return result;
    }
    
    // ==================== UPDATE ORDER STATUS ====================
    @PutMapping("/admin/{orderId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order != null) {
            order.setStatus(request.get("status"));
            orderRepository.save(order);
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.badRequest().body(Map.of("success", false));
    }
    
    // ==================== DOWNLOAD EXCEL REPORT ====================
    @GetMapping("/admin/report/download")
    public ResponseEntity<?> downloadExcelReport() {
        try {
            List<Order> orders = orderRepository.findAllOrdersAscending();
            
            if (orders.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "No orders found"));
            }
            
            org.apache.poi.ss.usermodel.Workbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook();
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.createSheet("Orders Report");
            
            org.apache.poi.ss.usermodel.CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(org.apache.poi.ss.usermodel.IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(org.apache.poi.ss.usermodel.IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(org.apache.poi.ss.usermodel.FillPatternType.SOLID_FOREGROUND);
            
            org.apache.poi.ss.usermodel.Row header = sheet.createRow(0);
            String[] columns = {"Order ID", "Order Number", "Customer Name", "Customer Email", "Customer Phone", 
                               "Order Date", "Total Amount (₹)", "Status", "Payment Method", "Shipping Address"};
            
            for (int i = 0; i < columns.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = header.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }
            
            int rowNum = 1;
            for (Order order : orders) {
                org.apache.poi.ss.usermodel.Row row = sheet.createRow(rowNum++);
                
                String customerName = order.getCustomerName();
                if (customerName == null || customerName.isEmpty()) {
                    if (order.getUser() != null && order.getUser().getFullName() != null) {
                        customerName = order.getUser().getFullName();
                    } else if (order.getUser() != null) {
                        customerName = order.getUser().getUsername();
                    } else {
                        customerName = "Guest";
                    }
                }
                
                row.createCell(0).setCellValue(order.getId());
                row.createCell(1).setCellValue(order.getOrderNumber());
                row.createCell(2).setCellValue(customerName);
                row.createCell(3).setCellValue(order.getCustomerEmail() != null ? order.getCustomerEmail() : "");
                row.createCell(4).setCellValue(order.getCustomerPhone() != null ? order.getCustomerPhone() : "");
                row.createCell(5).setCellValue(order.getOrderDate() != null ? order.getOrderDate().toString() : "");
                row.createCell(6).setCellValue(order.getTotalAmount());
                row.createCell(7).setCellValue(order.getStatus());
                row.createCell(8).setCellValue(order.getPaymentMethod());
                row.createCell(9).setCellValue(order.getShippingAddress() != null ? order.getShippingAddress() : "");
            }
            
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            workbook.write(out);
            workbook.close();
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "orders_report_" + System.currentTimeMillis() + ".xlsx");
            
            return new ResponseEntity<>(out.toByteArray(), headers, org.springframework.http.HttpStatus.OK);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to generate report: " + e.getMessage()));
        }
    }
}