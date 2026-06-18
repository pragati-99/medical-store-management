# 🏥 Medical Store Management System

A full-stack Medical Store Management System built using Spring Boot, React, and MySQL. The application allows users to browse medicines, manage carts, place orders, make payments, and track purchases. Administrators can manage products, orders, and inventory through a dedicated dashboard.

---

## 🚀 Features

### User Features

* User Registration & Login (JWT Authentication)
* Browse Medicines by Category
* Search Products
* Add to Cart
* Update / Remove Cart Items
* Wishlist Management
* Place Orders
* Cash on Delivery (COD)
* Razorpay Payment Integration
* Order History Tracking
* Product Reviews & Ratings

### Admin Features

* Admin Dashboard
* Add / Edit / Delete Products
* Manage Orders
* Update Order Status
* Inventory Management
* Low Stock Alerts
* Download Reports

---

## 🛠 Tech Stack

### Backend

* Java 17
* Spring Boot 3
* Spring Security
* JWT Authentication
* Spring Data JPA
* MySQL 8
* Maven

### Frontend

* React 18
* Vite
* Bootstrap 5
* Axios
* React Router DOM

### Payment Gateway

* Razorpay

---

## 📁 Project Structure

medical-store-management/

├── backend/

│ ├── controller/

│ ├── service/

│ ├── repository/

│ ├── model/

│ ├── config/

│ └── resources/

│

└── frontend/

├── components/

├── pages/

├── services/

├── context/

└── styles/

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone https://github.com/pragati-99/medical-store-management.git
cd medical-store-management
```

### Backend Setup (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

### Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## 🗄 Database Configuration

Create MySQL Database:

```sql
CREATE DATABASE medical_store_db;
```

Update application.properties:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/medical_store_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

---

## 🔐 Login Credentials

| Role  | Username | Password |
| ----- | -------- | -------- |
| Admin | admin    | admin123 |
| User  | user     | user123  |

---

## 💳 Razorpay Test Payment

```text
Card Number : 4111 1111 1111 1111
Expiry Date : Any Future Date
CVV         : 123
OTP         : 1221
```






---

## 🧪 Testing

| Module         | Status   |
| -------------- | -------- |
| Authentication | ✅ Passed |
| Products       | ✅ Passed |
| Cart           | ✅ Passed |
| Orders         | ✅ Passed |
| Wishlist       | ✅ Passed |
| Reviews        | ✅ Passed |
| Payment        | ✅ Passed |
| Admin Panel    | ✅ Passed |

---

## 🔮 Future Enhancements

* Email Notifications
* SMS Alerts
* Product Barcode Printing
* Analytics Dashboard
* Mobile Application
* Multi-language Support

---

## 👩‍💻 Author

**Pragati Khot**

Date: 15-06-2026

---

⭐ If you like this project, please give it a star on GitHub.
