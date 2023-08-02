const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");

const { connectDb } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
require("dotenv").config();
const app = express();

//connection with DB
connectDb();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//mounting routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to E-Commerce Website",
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`.bgCyan.white);
});
