const express = require('express');
const { Pool } = require('pg');
const userRoutes = require('./routes/userRoutes');
const ensureUsersTableExists = require('./models/userModel');
const fs = require('fs');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database connection setup
const pool = new Pool({
  user: process.env.DB_USER || 'projectdb',
  host: process.env.DB_HOST || '192.168.202.13',
  database: process.env.DB_DATABASE || 'projectdb',
  password: process.env.DB_PASSWORD || 'projectdb',
  port: process.env.DB_PORT || 5432,
});

app.use((req, res, next) => {
  const packageJson = require('./package.json');
  res.locals.appVersion = packageJson.version || 'Not Found';
  next();
});

ensureUsersTableExists(pool).ensureUsersTableExists();

app.use('/', userRoutes(pool));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});