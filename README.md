# 🛒 Product Management Backend

A backend REST API built with **Node.js**, **Express**, and **MongoDB (Mongoose)** to manage products with features like user authentication, role-based access, and automatic cleanup of expired products.

---

## ✅ Prerequisites

Make sure you have the following installed on your system:

- **[Node.js v20.19.0](https://nodejs.org/en/download)**
- **npm (v10+)**
- **MongoDB** (local or cloud like [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Git** (optional, for version control)

---

## 📦 Tech Stack

- **Node.js** v20.19.0
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT Authentication**
- **bcrypt** for password hashing
- **express-validator** for request validation
- **node-cron** for scheduled tasks
- **dotenv** for environment variable management
- **Nodemon** for development auto-reloading

---

## 📁 Project Structure

```
.
├── app.js              # Express app initialization
├── server.js           # Starts the server
├── seed.js             # Adds sample data to the database
├── models/             # Mongoose models (User, Product)
├── routes/             # Express route handlers
├── middleware/         # Auth & validation middleware
├── controllers/        # Logic for route handling
├── utils/              # Utility functions (if any)
├── .env                # Environment variables
├── package.json
└── README.md
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/jaykhavadia/product-management-backend.git
cd product-management-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
npm run dev  # for development (nodemon)
# or
npm start    # for production
```

The server should now be running at [http://localhost:5000](http://localhost:5000)

---

## 🌱 Add Sample Data (Optional)

You can populate your database with sample products:

```bash
npm run add-Sample-Data
```

---

## 🔐 Authentication

This project uses **JWT-based auth**. To access protected routes:

- Register/Login to get a token
- Use the token in headers:  
  `Authorization: Bearer <token>`

---

## 🧪 Example API Endpoints

| Method | Route                  | Description                  |
|--------|------------------------|------------------------------|
| POST   | `/api/auth/register`   | Register a new user          |
| POST   | `/api/auth/login`      | Login and get JWT            |
| GET    | `/api/products`        | Get all products             |
| POST   | `/api/products`        | Create new product (admin)   |
| PUT    | `/api/products/:id`    | Update product (admin)       |
| DELETE | `/api/products/:id`    | Delete product (admin)       |

> 🛡️ Protected routes require a valid JWT token and proper user role.

---

## 🕒 Cron Job

Expired products are automatically deleted via `node-cron`.

---

## 🧹 Code Style

- Code formatting by **Prettier**
- Linting via **ESLint**

```bash
npx prettier --write .
npx eslint . --fix
```

---

## 📜 License

This project is licensed under the **ISC License**.

---

## 🤝 Contributing

Feel free to fork this repo and submit a PR. Issues and suggestions are welcome.
