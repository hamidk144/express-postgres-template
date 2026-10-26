<div align="center">

# 🚀 Express + PostgreSQL Boilerplate

**A clean, production-ready REST API starter built with Node.js, Express, and PostgreSQL using raw SQL and layered architecture.**

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-blue.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Project Structure](#-project-structure) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Architecture](#-architecture)

</div>

---

## ✨ Features

- 🏗️ **Clean Layered Architecture**: Strict separation of concerns (Routes → Controllers → Models → DB).
- ⚡ **Native Connection Pool**: High-performance PostgreSQL connection pooling using `pg.Pool`.
- 🛡️ **SQL Injection Protection**: 100% parameterized queries for safe, secure database operations.
- 🔄 **Full CRUD Operations**: Complete Create, Read, Update, and Delete implementation using modern SQL (`RETURNING *`, `COALESCE`).
- 🚦 **Robust Error Handling**: Centralized error middleware with automatic mapping for PostgreSQL error codes (`unique_violation`, `check_violation`, etc.).
- 📦 **Zero Heavy ORM Overhead**: Direct, transparent SQL with zero abstraction penalty.
- 🔁 **Hot Reload**: Pre-configured with `nodemon` for fast local development.

---

## 📁 Project Structure

```text
├── src/
│   ├── config/
│   │   └── db.js            # PostgreSQL connection pool configuration
│   ├── controllers/
│   │   └── bookController.js# Request validation & HTTP response handling
│   ├── models/
│   │   └── bookModel.js     # Data access layer & raw SQL queries
│   ├── routes/
│   │   └── bookRoutes.js    # API route definitions
│   ├── middlewares/
│   │   └── errorHandler.js  # Global error handling & 404 middleware
│   ├── db/
│   │   ├── schema.sql       # DDL schema definition
│   │   └── initDb.js        # Automated migration & seed script
│   ├── app.js               # Express application configuration
│   └── server.js            # Server entrypoint & graceful shutdown
├── .env.example             # Template for environment variables
├── .gitignore               # Ignored dependencies & secrets
├── package.json             # Scripts & dependencies
└── README.md                # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/express-postgres-starter.git
   cd express-postgres-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   
   Copy `.env.example` to `.env` and fill in your PostgreSQL credentials:
   ```bash
   cp .env.example .env
   ```

   ```env
   PORT=5000
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=postgres
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   ```

4. **Initialize Database**
   
   Run the migration script to create the necessary tables and seed demo records:
   ```bash
   node src/db/initDb.js
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:5000`.

---

## 📡 API Reference

### Base URL: `http://localhost:5000/api/books`

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API status and root documentation | `200 OK` |
| `GET` | `/api/books` | Retrieve list of all books | `200 OK` |
| `GET` | `/api/books/:id` | Retrieve single book by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/books` | Create a new book | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/books/:id` | Update an existing book | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/books/:id` | Remove a book | `200 OK` / `404 Not Found` |

### Example Request Body (POST / PUT)

```json
{
  "title": "Designing Data-Intensive Applications",
  "author": "Martin Kleppmann",
  "price": 45.00,
  "in_stock": true
}
```

### Example Response (`201 Created`)

```json
{
  "success": true,
  "message": "Book created successfully.",
  "data": {
    "id": 1,
    "title": "Designing Data-Intensive Applications",
    "author": "Martin Kleppmann",
    "price": "45.00",
    "in_stock": true,
    "created_at": "2026-10-26T17:30:00.000Z",
    "updated_at": "2026-10-26T17:30:00.000Z"
  }
}
```

---

## 🏛️ Architecture Highlights

- **`app.js` vs `server.js`**: By separating the Express app initialization from `app.listen()`, you can test API endpoints using tools like `supertest` without binding to live network sockets.
- **Graceful Shutdown**: Listens for `SIGINT` and `SIGTERM` signals to cleanly drain and terminate database pool connections before exiting.
- **Defensive Error Handling**: SQL errors (e.g. invalid types, duplicate unique constraints) are intercepted and translated into semantic HTTP status codes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
