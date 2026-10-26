const db = require('../config/db');

/**
 * ============================================================
 * BOOK MODEL (Data Access Layer)
 * ============================================================
 * This layer contains all RAW SQL queries.
 *
 * KEY SQL CONCEPTS:
 * 1. Parameterized Queries:
 *    We write placeholders like $1, $2 instead of concatenating strings.
 *    ❌ NEVER DO: `SELECT * FROM books WHERE id = ${id}` (Vulnerable to SQL Injection!)
 *    ✅ ALWAYS DO: `query('SELECT * FROM books WHERE id = $1', [id])`
 *
 * 2. RETURNING Clause:
 *    PostgreSQL supports `RETURNING *` on INSERT, UPDATE, and DELETE queries.
 *    This returns the affected rows immediately without needing a second SELECT query!
 */

// 1. CREATE: Insert a new book record
const createBook = async ({ title, author, price, in_stock = true }) => {
  const sql = `
    INSERT INTO books (title, author, price, in_stock)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [title, author, price, in_stock];

  const result = await db.query(sql, values);
  // result.rows is an array of returned objects. We return the first one.
  return result.rows[0];
};

// 2. READ: Get all books
const getAllBooks = async () => {
  const sql = `
    SELECT id, title, author, price, in_stock, created_at, updated_at
    FROM books
    ORDER BY id ASC;
  `;
  const result = await db.query(sql);
  return result.rows;
};

// 3. READ: Get a single book by ID
const getBookById = async (id) => {
  const sql = `
    SELECT id, title, author, price, in_stock, created_at, updated_at
    FROM books
    WHERE id = $1;
  `;
  const result = await db.query(sql, [id]);
  // Returns undefined if row was not found, or the book object if found
  return result.rows[0];
};

// 4. UPDATE: Modify an existing book record
const updateBook = async (id, { title, author, price, in_stock }) => {
  const sql = `
    UPDATE books
    SET 
      title = COALESCE($1, title),
      author = COALESCE($2, author),
      price = COALESCE($3, price),
      in_stock = COALESCE($4, in_stock),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *;
  `;
  // COALESCE(new_val, existing_col) allows partial updates!
  // If new_val is null/undefined, it keeps the existing value.
  const values = [title, author, price, in_stock, id];

  const result = await db.query(sql, values);
  return result.rows[0];
};

// 5. DELETE: Remove a book record by ID
const deleteBook = async (id) => {
  const sql = `
    DELETE FROM books
    WHERE id = $1
    RETURNING *;
  `;
  const result = await db.query(sql, [id]);
  return result.rows[0];
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
