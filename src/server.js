require('dotenv').config();
const app = require('./app');
const initDb = require('./db/initDb');
const { pool } = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Server Startup Routine:
 * 1. Initialize DB (create tables & seed initial data if needed)
 * 2. Start HTTP server listener
 */
async function startServer() {
  try {
    // Ensure DB tables are ready before handling requests
    await initDb();

    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📚 Books API available at http://localhost:${PORT}/api/books\n`);
    });

    // Graceful Shutdown: close pool connection on exit
    const handleShutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await pool.end();
        console.log(' PostgreSQL pool closed. Process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  } catch (error) {
    console.error(' Server startup failed:', error.message);
    console.error('\n⚠️ Tip: Check your PostgreSQL credentials in .env and verify PostgreSQL service is running.');
    process.exit(1);
  }
}

startServer();
