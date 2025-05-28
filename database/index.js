const { Pool } = require("pg");

// Create a pool using Render's environment variables
const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
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
