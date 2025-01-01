import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import restaurantRoutes from "./routes/restaurants.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import addressRoutes from "./routes/address.js";
import paymentRoutes from "./routes/payment.js"
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware for parsing JSON
app.use(bodyParser.json());
app.use(cors());

const logger = (req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.url);
    next();
};

app.use(logger);

// Authorization middleware
const verifyAuthorization = (req, res, next) => {
    const token = req.headers["auth-token"];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ msg: "Unauthorized or Invalid Token" });
            } else {
                next();
            }
        });
    } else {
        res.status(403).json({ msg: "Unauthorized" });
    }
};

// Use the auth routes
// Below auth APIs do not require authorization
app.use("/auth", authRoutes);

// Below APIs require authorization
app.use("/restaurants", verifyAuthorization, restaurantRoutes);
app.use("/cart", verifyAuthorization, cartRoutes);
app.use("/order", verifyAuthorization, orderRoutes);
app.use("/address", verifyAuthorization, addressRoutes)
app.use("/api/payment", paymentRoutes)
// Start the server
const PORT = process.env.PORT || 6000;

const url = process.env.DB_URL;

// MongoDB connection
mongoose
    .connect(url)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log("Server is running!!!");
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });