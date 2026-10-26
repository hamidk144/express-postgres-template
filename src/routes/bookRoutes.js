const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');

/**
 * ============================================================
 * BOOK ROUTES
 * ============================================================
 * Maps HTTP methods and endpoint paths to controller actions.
 *
 * Base URL mounted in app.js: /api/books
 */

// Route: /api/books
router
  .route('/')
  .get(getBooks)      // GET /api/books -> Retrieve all books
  .post(createBook);  // POST /api/books -> Create a new book

// Route: /api/books/:id
router
  .route('/:id')
  .get(getBook)       // GET /api/books/:id -> Retrieve one book
  .put(updateBook)    // PUT /api/books/:id -> Update a book
  .delete(deleteBook);// DELETE /api/books/:id -> Delete a book

module.exports = router;
