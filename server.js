require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Order Management Backend Running");
});

const authRoutes = require('./server/routes/authRoutes');
const orderRoutes = require('./server/routes/orders');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

// TEMP: Start server even if MongoDB is down
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// OPTIONAL MongoDB (enable later)
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/online_order")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB error:", err.message);
  });

