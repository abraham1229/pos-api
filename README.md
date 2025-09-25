# POS System Backend

POS System Backend is a RESTful API for a Point of Sale application. The API provides endpoints for product management, transaction processing, coupon system, and inventory tracking.

This repository contains the **backend** API. The frontend application is available at: https://github.com/abraham1229/pos-page

## 📋 Features

- Product management with categories and inventory tracking
- Transaction processing with cart functionality
- Coupon system with percentage discounts
- Image upload for products using Cloudinary
- Real-time inventory updates
- Transaction history and reporting

## 🔧 Tech Overview

### Backend
- Built with **NestJS** and **TypeScript**
- **PostgreSQL** with **TypeORM** ORM for database
- **Class-validator** and **Class-transformer** for input validation
- **Jest** for testing
- **Cloudinary** for image storage and management
- **Date-fns** for date manipulation
- **Streamifier** for file handling

## 🚀 Getting Started

> Node.js version used: **22.5.1**

### Backend Setup
```bash
cd backend  
npm install  
npm run start:dev
```

## 🚧 Build & Deploy

### Backend
```bash
cd backend
npm run build
```

### Database Seeding
```bash
cd backend
npm run seed
```
