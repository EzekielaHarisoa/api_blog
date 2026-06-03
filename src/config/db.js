const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query("SELECT NOW()")
  .then(() => console.log("✅ Neon connecté"))
  .catch(err => console.error("❌ Neon erreur :", err));

console.log("DATABASE_URL =", process.env.DATABASE_URL);

module.exports = pool;