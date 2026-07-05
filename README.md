# Full-Stack MERN Inventory Management System

A complete, production-ready Inventory Management System built with the MERN stack (MongoDB, Express, React, Node.js). 

## 🚀 Features

### Backend
- **RESTful API** built with Express.js and Node.js
- **MongoDB database** with Mongoose ODM
- **JWT Authentication** for admin login and secure API routes
- **Advanced Querying**: Search, Filter (Category, Supplier, Stock Status), Sorting, and Pagination
- **CSV Data Management**: Export inventory to CSV and import products via CSV bulk upload
- **Dashboard Analytics**: Real-time aggregate statistics for inventory value, stock warnings, and category counts

### Frontend
- **Modern, Premium UI**: Built with React (Vite) and Tailwind CSS, featuring smooth transitions and dark mode.
- **State Management**: React Context API for Auth and Theme states
- **Interactive Charts**: Visualized inventory value using Recharts
- **Form Handling & Validation**: Controlled components with immediate feedback
- **Responsive Design**: Mobile-friendly sidebar and scalable tables
- **User Experience**: Toast notifications (react-hot-toast), empty states, loading spinners, and confirmation dialogs

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router DOM, Tailwind CSS, Axios, Recharts, React Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js, Multer, Fast-CSV

## 📂 Folder Structure

```
inventory-management-system/
├── client/                 # Frontend React Application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components (Sidebar, TopNav)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── layouts/        # Layout wrappers
│   │   ├── pages/          # Full page views (Login, Dashboard, ProductList...)
│   │   ├── services/       # API configuration (Axios instances)
│   │   ├── App.jsx         # Routing configuration
│   │   └── main.jsx        # App entry point
│   └── tailwind.config.js
│
└── server/                 # Backend Node.js Application
    ├── config/             # DB connection
    ├── controllers/        # Request handlers (auth, products, csv)
    ├── middleware/         # Custom middleware (auth, error handling)
    ├── models/             # Mongoose schemas (User, Product)
    ├── routes/             # Express routes
    └── server.js           # Server entry point
```

## ⚙️ Installation Guide

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas URI)

### 1. Clone & Setup Backend
```bash
# Navigate to backend directory
cd server

# Install dependencies
npm install

# Create .env file based on environment variables below

# Run development server
npm run dev
```

### 2. Setup Frontend
```bash
# Navigate to frontend directory
cd client

# Install dependencies
npm install

# Run Vite development server
npm run dev
```

## 🔐 Environment Variables

Create a `.env` file in the `server` directory with the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/inventory_db
JWT_SECRET=supersecretjwtkey_12345
NODE_ENV=development
```

## 📚 API Documentation

### Auth Endpoints
- `POST /api/auth/login` - Authenticate admin & get token
- `POST /api/auth/register` - Register a new admin user

### Product Endpoints
- `GET /api/products` - Get all products (supports `?keyword`, `?category`, `?supplier`, `?stock`, `?sort`, `?pageNumber`)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Add a new product (Admin only)
- `PUT /api/products/:id` - Update a product (Admin only)
- `DELETE /api/products/:id` - Delete a product (Admin only)
- `GET /api/products/summary/dashboard` - Get dashboard aggregate statistics

### CSV Endpoints
- `GET /api/csv/export` - Export all products to CSV
- `POST /api/csv/import` - Upload a CSV file to bulk import products (requires `multipart/form-data` with field `file`)

## 🌐 Deployment Instructions

### Frontend (Vercel)
1. Push your repository to GitHub.
2. Go to Vercel and import the project.
3. Set the Framework Preset to `Vite`.
4. Set the Root Directory to `client`.
5. Add environment variables if your API URL changes (e.g., `VITE_API_URL`).
6. Deploy.

### Backend (Render)
1. Create a new Web Service on Render.
2. Connect your GitHub repository.
3. Set Root Directory to `server`.
4. Set Build Command to `npm install`.
5. Set Start Command to `npm start`.
6. Add all Environment Variables (`MONGO_URI`, `JWT_SECRET`, etc.).
7. Deploy.

### Database (MongoDB Atlas)
1. Create a free cluster on MongoDB Atlas.
2. Add a Database User and whitelist your IP (or allow all IPs `0.0.0.0/0` for Render).
3. Get the Connection String and update the `MONGO_URI` environment variable on your backend host.
