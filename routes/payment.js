import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config(); // Load environment variables from .env file

const router = express.Router();

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: process.env.VITE_RAZORPAY_KEY_ID, // Fetch from environment variables
    key_secret: process.env.SECRET_KEY, // Fetch from environment variables
});

// Route: Create an Order
// POST: http://localhost:6000/api/payment/order
router.post("/order", async (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ message: "Amount is required!" });
    }

    try {
        const options = {
            amount: Number(amount) * 100, // Convert to smallest currency unit (paise)
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"), // Unique receipt ID
        };

        // Create an order using Razorpay instance
        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({ data: order });
        console.log("Order created:", order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Something went wrong!", error: error.message });
    }
});
//Rote:Verify the Order
// POST: http://localhost:6000/api/payment/verify

router.post("/verify", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log("req.body", req.body);

    try {
        // Get Secret Key from Environment Variables
        const secretKey = process.env.SECRET_KEY;

        if (!secretKey) {
            return res.status(500).json({ message: "Secret key not configured properly." });
        }

        // Create Signature String
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        // Generate Expected Signature
        const expectedSign = crypto
            .createHmac("sha256", secretKey)
            .update(sign)
            .digest("hex");

        console.log("Expected Signature:", expectedSign);
        console.log("Razorpay Signature:", razorpay_signature);

        // Verify Signature
        const isAuthentic = expectedSign === razorpay_signature;

        if (isAuthentic) {
            // Save Payment to Database
            const payment = new payment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });

            await payment.save();

            return res.status(200).json({ message: "Payment successfully verified." });
        } else {
            return res.status(400).json({ message: "Payment verification failed. Invalid signature." });
        }
    } catch (error) {
        console.error("Error during payment verification:", error);
        return res.status(500).json({ message: "Internal Server Error!" });
    }
});

export default router;
