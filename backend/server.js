require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const cylinderRoutes = require("./routes/cylinders");
const transactionRoutes = require("./routes/transactions");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cylinders", cylinderRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (_req, res) => res.json({ status: "LPG API running" }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error:", err.message);
    process.exit(1);
  });