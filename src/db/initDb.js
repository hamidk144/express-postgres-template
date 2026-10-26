const fs = require('fs');
const path = require('path');
const db = require('../config/db');

/**
 * Initializes the database tables by executing schema.sql.
 * Also seeds initial records if the table is empty.
 */
async function initDb() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log(' Running database migrations...');
    await db.query(schemaSql);
    console.log(' Table "books" checked/created successfully.');

    // Optional: Seed initial demo data if books table is empty
    const checkCount = await db.query('SELECT COUNT(*) FROM books;');
    const count = parseInt(checkCount.rows[0].count, 10);

    if (count === 0) {
      console.log(' Seeding sample books into database...');
      const seedSql = `
        INSERT INTO books (title, author, price, in_stock) VALUES
        ('Clean Code', 'Robert C. Martin', 32.99, true),
        ('The Pragmatic Programmer', 'Andrew Hunt, David Thomas', 39.50, true),
        ('Designing Data-Intensive Applications', 'Martin Kleppmann', 45.00, true);
      `;
      await db.query(seedSql);
      console.log(' 3 sample books seeded.');
    } else {
      console.log(` Found ${count} existing books in the database.`);
    }
  } catch (error) {
    console.error(' Failed to initialize database:', error.message);
    throw error;
  }
}

// If run directly via "node src/db/initDb.js", run and exit
if (require.main === module) {
  initDb()
    .then(() => {
      console.log(' Database initialization completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(' Database initialization error:', err);
      process.exit(1);
    });
}

module.exports = initDb;
