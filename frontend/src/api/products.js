// src/api/products.js
import API_BASE_URL from './config';

export const productAPI = {
  getAllProducts: async () => {
    try {
      console.log('Fetching all products from:', `${API_BASE_URL}/products/public`);
      const response = await fetch(`${API_BASE_URL}/products/public`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products fetched successfully:', data?.length || 0);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  
  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },
  
  getProductsByCategory: async (category) => {
    try {
      console.log('Fetching products for category:', category);
      // Fix: Category name mapping
      let categoryParam = category;
      if (category === 'babycare') categoryParam = 'Baby Care';
      if (category === 'healthcare') categoryParam = 'Health Care';
      if (category === 'oralcare') categoryParam = 'Oral Care';
      if (category === 'skincare') categoryParam = 'Skin Care';
      if (category === 'haircare') categoryParam = 'Hair Care';
      
      const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(categoryParam)}`);
      const data = await response.json();
      console.log('Category products:', data?.length || 0);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }
};