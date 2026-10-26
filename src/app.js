const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();

/**
 * ============================================================
 * GLOBAL MIDDLEWARES
 * ============================================================
 */

// 1. Parse JSON request bodies (req.body)
app.use(express.json());

// 2. Simple console request logger
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * ============================================================
 * ROUTE MOUNTING
 * ============================================================
 */

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Welcome to the Bookstore REST API with PostgreSQL!',
    endpoints: {
      getBooks: 'GET /api/books',
      getBookById: 'GET /api/books/:id',
      createBook: 'POST /api/books',
      updateBook: 'PUT /api/books/:id',
      deleteBook: 'DELETE /api/books/:id',
    },
  });
});

// Mount the books CRUD resource under /api/books
app.use('/api/books', bookRoutes);

/**
 * ============================================================
 * ERROR HANDLING
 * ============================================================
 */
// Handle 404 for any unregistered paths
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
