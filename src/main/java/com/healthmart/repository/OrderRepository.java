package com.healthmart.repository;

import com.healthmart.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
    
    List<Order> findByUserIdOrderByOrderDateAsc(Long userId);
    

    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    
 
    @Query("SELECT o FROM Order o ORDER BY o.orderDate ASC")
    List<Order> findAllOrdersAscending();
    
  
    Optional<Order> findByOrderNumber(String orderNumber);
}