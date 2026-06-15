package com.healthmart.repository;

import com.healthmart.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByCategoryIgnoreCase(String category);
    List<Product> findByInStockTrue();
    List<Product> findByStockQuantityLessThan(int threshold);
}