-- ============================================
-- COMPLETE DATABASE SETUP
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS healthmart_db;
CREATE DATABASE healthmart_db;
USE healthmart_db;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile_number VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(100),
    category VARCHAR(50),
    price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    image VARCHAR(500),
    hover_image VARCHAR(500),
    tag VARCHAR(50),
    discount INT,
    brand VARCHAR(100),
    description TEXT,
    stock_quantity INT DEFAULT 100,
    rating DECIMAL(3,2) DEFAULT 4.5,
    reviews INT DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE
);

-- ============================================
-- 3. CARTS TABLE
-- ============================================
CREATE TABLE carts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- 4. CART ITEMS TABLE
-- ============================================
CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10,2),
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============================================
-- 5. ORDERS TABLE
-- ============================================
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    shipping_address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================
-- 6. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============================================
-- INSERT USERS
-- ============================================
INSERT INTO users (full_name, email, mobile_number, password, role) VALUES 
('Admin User', 'admin@healthmart.com', '9999999999', 'admin123', 'ADMIN'),
('Test User', 'test@healthmart.com', '8888888888', 'test123', 'USER'),
('Regular User', 'user@healthmart.com', '7777777777', 'user123', 'USER');

-- ============================================
-- INSERT PRODUCTS
-- ============================================
INSERT INTO products (name, category, price, original_price, discount, brand, description, stock_quantity, image) VALUES 
('Organic Baby Wipes', 'Baby Care', 14.99, 24.99, 40, 'OrganicBaby', 'Hypoallergenic wipes for sensitive skin', 100, '/images/Baby Wipes.jpg'),
('Gentle Baby Shampoo', 'Baby Care', 12.99, 18.99, 32, 'GentleBaby', 'Tear-free formula for babies', 80, '/images/Gental Baby Shampo.jpg'),
('Vitamin D3 Drops', 'Health Care', 24.99, 34.99, 29, 'HealthPlus', 'Boosts immunity, supports bone health', 50, '/images/Vitamin D3 Drop.jpg'),
('Immune Boost Tablets', 'Health Care', 19.99, 29.99, 33, 'HealthPlus', 'Boost your immune system naturally', 60, '/images/Immune Boost Tab.jpg'),
('Fluoride Toothpaste', 'Oral Care', 8.99, 14.99, 40, 'DentaCare', 'Cavity protection, fresh breath', 200, '/images/Fluoride Toothpaste.jpg'),
('Whitening Toothpaste', 'Oral Care', 10.99, 16.99, 35, 'DentaCare', 'Professional whitening formula', 150, '/images/Tooth whitening.jpg'),
('Nourishing Face Cream', 'Skin Care', 18.99, 29.99, 37, 'SkinCarePro', 'Deep moisturizing cream', 75, '/images/nourishing cream.jpg'),
('Herbal Hair Oil', 'Hair Care', 15.99, 24.99, 36, 'HerbalEssentials', 'Strengthens hair roots', 90, '/images/Herbal hair oil.jpg'),
('Paracetamol 500mg', 'Medicine', 25.00, 35.00, 29, 'Dolo', 'Effective for fever and pain relief', 500, '/images/Wellness Medicine.jpg'),
('Cetrizine 10mg', 'Medicine', 15.00, 25.00, 40, 'Cetzine', 'For allergy relief', 300, '/images/Cetrizine 10 mg.jpg'),
('Body Butter', 'Skin Care', 24.99, 39.99, 38, 'SkinCarePro', 'Luxurious body butter for deep moisturizing', 95, '/images/Body Butter.jpg'),
('Hand Sanitizer', 'Personal Care', 5.99, 12.99, 54, 'Dettol', 'Alcohol-based hand sanitizer. Kills 99.9% germs', 500, '/images/Sanotizer.png');

-- ============================================
-- CREATE CARTS FOR USERS
-- ============================================
INSERT INTO carts (user_id, total_amount) 
SELECT id, 0 FROM users;

-- ============================================
-- FINAL VERIFICATION
-- ============================================
SELECT '✅ DATABASE SETUP COMPLETE!' AS Status;
SELECT COUNT(*) AS Total_Users FROM users;
SELECT COUNT(*) AS Total_Products FROM products;

-- ============================================
-- LOGIN CREDENTIALS
-- ============================================
SELECT '=========================================' AS '';
SELECT 'LOGIN CREDENTIALS:' AS '';
SELECT 'Admin: admin@healthmart.com / admin123' AS '';
SELECT 'Test User: test@healthmart.com / test123' AS '';
SELECT 'Regular User: user@healthmart.com / user123' AS '';

SET FOREIGN_KEY_CHECKS = 1;