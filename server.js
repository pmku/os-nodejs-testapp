const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 8080;

// DB connection config from environment variables
const pool = new Pool({
  host: process.env.PGHOST || "postgresql",
  user: process.env.PGUSER || "user1",
  password: process.env.PGPASSWORD || "pass123",
  database: process.env.PGDATABASE || "visits",
  port: 5432
});

// Ensure visits table exists
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("✅ visits table ready");
}

// Main route
app.get("/", async (req, res) => {
  try {
    await pool.query("INSERT INTO visits (timestamp) VALUES (NOW())");
    const result = await pool.query("SELECT COUNT(*) FROM visits");
    res.send(`
      <h1>Hello OpenShift 🚀</h1>
      <p>Total visits: ${result.rows[0].count}</p>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

// Health check endpoint
app.get("/healthz", (req, res) => res.send("OK"));

app.listen(PORT, async () => {
  console.log(`✅ App running on port ${PORT}`);
  await initDB();
});