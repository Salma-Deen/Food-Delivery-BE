import express from "express";
import Order from "../models/order.js"; // Ensure the path is correct and ends with .js
import Cart from "../models/cart.js";   // Ensure the path is correct and ends with .js

const router = express.Router();

// Temporary in-memory cart (this can be replaced by a database model)
let cart = [];

router.get("/:phoneNumber", async (req, res) => {
    const { phoneNumber } = req.params;

    const orders = await Order.find({ phoneNumber });

    if (orders.length) {
        res.status(200).json(orders); // Return the orders instead of the cart
    } else {
        res.status(404).json({ message: "No Orders Found" });
    }
});

router.post("/place-order/:cartId", async (req, res) => {
    const { cartId } = req.params;
    const cart = await Cart.findOne({ id: cartId }, { _id: 0, __v: 0 });

    if (cart) {
        const orderData = new Order({
            ...cart.toObject(), // Convert Mongoose document to plain object
        });
        await orderData.save();
        // Clearing the Cart
        await Cart.deleteOne({ id: cartId });
        res.status(201).json({ message: "Order Placed Successfully" });
    } else {
        res.status(404).json({ message: "No Cart Found" });
    }
});

export default router;