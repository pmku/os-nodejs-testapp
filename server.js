const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

// Health check endpoint for OpenShift
app.get("/healthz", (req, res) => res.send("OK"));

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log(`✅ App running on port ${PORT}`);
});