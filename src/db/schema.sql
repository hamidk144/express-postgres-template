-- SQL DDL (Data Definition Language) for Books table

-- 1. Create the table if it does not already exist
CREATE TABLE IF NOT EXISTS books (
  -- id: Unique identifier, auto-incremented integer primary key
  id SERIAL PRIMARY KEY,
  
  -- title: Book title, variable characters up to 255, cannot be null
  title VARCHAR(255) NOT NULL,
  
  -- author: Author name, cannot be null
  author VARCHAR(255) NOT NULL,
  
  -- price: Decimal number with 2 decimal places, must be >= 0
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  
  -- in_stock: Boolean flag indicating if copies are available
  in_stock BOOLEAN DEFAULT TRUE,
  
  -- created_at: Timestamp recorded when the row is first inserted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- updated_at: Timestamp updated whenever the row is modified
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
