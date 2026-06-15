import React from 'react';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import ProductGrid from '../components/ProductGrid';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <ProductGrid />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;