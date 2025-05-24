const { Pool } = require("pg");
require("dotenv").config();

// Create a pool using environment variables
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Required for Render-hosted databases
  },
});

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("Executed query", { text });
      return res;
    } catch (error) {
      console.error("Query error", { text, error });
      throw error;
    }
  },
};
