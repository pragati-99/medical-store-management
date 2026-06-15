import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  return (
    <div className="section">
      <h2 className="section-title">
        {category ? `${category} Products` : 'All Products'}
      </h2>
      <p className="section-subtitle">Quality products for your health & wellness</p>
      <ProductGrid category={category} />
    </div>
  );
};

export default Products;