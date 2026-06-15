import React, { useState, useEffect } from 'react';

function TestPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/products/public')
      .then(res => res.json())
      .then(data => {
        console.log('Products:', data);
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading products from backend...</h2>;
  if (error) return <h2 style={{color: 'red'}}>Error: {error}. Make sure backend is running on port 8080</h2>;
  
  return (
    <div>
      <h1>Backend Connection Test</h1>
      <p>Connected successfully! Found {products.length} products.</p>
      <ul>
        {products.slice(0,5).map(p => (
          <li key={p.id}>{p.name} - ₹{p.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default TestPage;