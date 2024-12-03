import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectToMongo } from "./config/db.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config({
    path:'./.env'
});

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
connectToMongo();

// Register Routes
app.use("/api/payment", paymentRoutes);

app.listen(3001, () => {
  console.log("Backend listening at http://localhost:3001");
});
