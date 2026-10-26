const BookModel = require('../models/bookModel');

/**
 * ============================================================
 * BOOK CONTROLLER (HTTP Handler Layer)
 * ============================================================
 * The controller is responsible for:
 * 1. Extracting data from the request (req.body, req.params)
 * 2. Validating user input before hitting the database
 * 3. Calling the model function
 * 4. Formatting and returning the appropriate HTTP response & status code
 */

// @desc    Get all books
// @route   GET /api/books
const getBooks = async (req, res, next) => {
  try {
    const books = await BookModel.getAllBooks();
    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error); // Pass to centralized error handler
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
const getBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate that id is an integer
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID. Book ID must be a number.',
      });
    }

    const book = await BookModel.getBookById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new book
// @route   POST /api/books
const createBook = async (req, res, next) => {
  try {
    const { title, author, price, in_stock } = req.body;

    // Basic Input Validation
    if (!title || !author || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, author, and price.',
      });
    }

    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number.',
      });
    }

    const newBook = await BookModel.createBook({
      title,
      author,
      price: Number(price),
      in_stock: in_stock !== undefined ? Boolean(in_stock) : true,
    });

    // 201 Created is the standard HTTP status code for newly created resources
    res.status(201).json({
      success: true,
      message: 'Book created successfully.',
      data: newBook,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing book
// @route   PUT /api/books/:id
const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID. Book ID must be a number.',
      });
    }

    // Check if book exists first
    const existingBook = await BookModel.getBookById(id);
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id ${id}`,
      });
    }

    const { title, author, price, in_stock } = req.body;

    if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number.',
      });
    }

    const updatedBook = await BookModel.updateBook(id, {
      title: title ?? null,
      author: author ?? null,
      price: price !== undefined ? Number(price) : null,
      in_stock: in_stock !== undefined ? Boolean(in_stock) : null,
    });

    res.status(200).json({
      success: true,
      message: 'Book updated successfully.',
      data: updatedBook,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID. Book ID must be a number.',
      });
    }

    const deletedBook = await BookModel.deleteBook(id);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully.',
      data: deletedBook,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
