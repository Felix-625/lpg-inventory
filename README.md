$readmeContent = @'
# 🛢️ LPG Store Inventory System

A modern, full-stack inventory management system designed for LPG (Liquefied Petroleum Gas) retailers. This application provides real-time tracking of cylinder stocks across different brands and sizes, logs deliveries and sales, and generates monthly sales reports.

## ✨ Features

- **User Authentication:** Secure login and registration using JWT and bcrypt.
- **Multi-Brand Tracking:** Manage various brands (Petron Gasul Elite, Solane, Fiesta Gas, TownGaz) and sizes (11kg, 50kg).
- **Real-Time Dashboard:** Visual overview of full vs. empty cylinders.
- **Low-Stock Alerts:** Visual badges and banners when full stock drops below a defined threshold.
- **Inventory Management:** Full CRUD (Create, Read, Update, Delete) capabilities for cylinder types.
- **Deliveries:** Log incoming stock and return empties to suppliers.
- **Sales & Swaps:** Record customer transactions, handling the exchange of full cylinders for empties.
- **Sales History:** Filter sales by month and search by customer or brand.

## 🛠️ Tech Stack

**Frontend:**
- React (via Vite)
- Tailwind CSS (v4)
- React Router DOM
- Axios
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB (Community Server installed and running locally or via Atlas)

### 1. Clone the Repository

    git clone https://github.com/YOUR_GROUPNAME/lpg-inventory.git
    cd lpg-inventory

### 2. Backend Setup

    cd backend
    npm install

Create a .env file in the backend folder and add the following:

    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/lpg_inventory
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=7d

Seed the initial database with cylinder types (optional but recommended):

    node seed.js

Start the backend server:

    npm run dev

(Server runs on http://localhost:5000)

### 3. Frontend Setup

Open a new terminal window.

    cd frontend
    npm install

Create a .env file in the frontend folder:

    VITE_API_URL=http://localhost:5000/api

Start the frontend development server:

    npm run dev

(App runs on http://localhost:5173)

## 📂 Project Structure

    lpg-inventory/
    ├── backend/
    │   ├── middleware/       # Auth middleware (JWT verification)
    │   ├── models/           # Mongoose schemas (User, Cylinder, Transaction)
    │   ├── routes/           # Express API routes
    │   ├── server.js         # Backend entry point
    │   └── seed.js           # Initial data seeding script
    └── frontend/
        ├── src/
        │   ├── api/          # Axios instance configuration
        │   ├── components/   # Reusable UI components
        │   ├── context/      # AuthContext provider
        │   ├── pages/        # Page views (Dashboard, Sales, Inventory, etc.)
        │   ├── App.jsx       # Route definitions
        │   └── index.css     # Tailwind theme variables
        └── vite.config.js

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create a new user account |
| POST | /api/auth/login | Authenticate and receive a JWT |
| GET | /api/cylinders | Retrieve all cylinder types |
| POST | /api/cylinders | Add a new cylinder type |
| PUT | /api/cylinders/:id | Edit an existing cylinder type |
| DELETE | /api/cylinders/:id | Delete a cylinder type |
| GET | /api/transactions | Retrieve transactions (supports ?type=sale&month=YYYY-MM) |
| POST | /api/transactions/delivery | Log an incoming stock delivery |
| POST | /api/transactions/sale | Log a customer sale/swap |

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch (git checkout -b feature/AmazingFeature).
3. Commit your changes (git commit -m 'Add some AmazingFeature').
4. Push to the branch (git push origin feature/AmazingFeature).
5. Open a Pull Request.

---
*Built for modern LPG retail management.*
'@
