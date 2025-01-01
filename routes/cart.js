import express from "express";
import Cart from "../models/cart.js"; // Ensure the path ends with .js
import { v4 } from "uuid"; // Importing uuid with a different name

const router = express.Router();

// @route   GET /cart/:phoneNumber
// @desc    Get all cart items
router.get("/:phoneNumber", async (req, res) => {
    const { phoneNumber } = req.params;

    try {
        const cart = await Cart.findOne({ phoneNumber });

        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "No Products in Cart" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   POST /add-to-cart/:phoneNumber
// @desc    Add item to cart
router.post("/add-to-cart/:phoneNumber", async (req, res) => {
    const { phoneNumber } = req.params;
    const { price, qty, image, restrauntId, name } = req.body;

    // Validate fields
    if (!price || !qty || !image || !restrauntId || !name) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Add new dish to the cart
    const newDish = {
        price,
        qty,
        image,
        restrauntId,
        name,
    };

    console.log(newDish);

    try {
        const cart = await Cart.findOne({ phoneNumber }, { _id: 0, __v: 0 });

        if (cart) {
            const existingCart = {
                ...cart.toObject(),
            };

            existingCart.total += price * qty;
            existingCart.items.push(newDish);

            await Cart.replaceOne({ phoneNumber }, existingCart);
            res.json({ message: "Item Added Successfully" });
        } else {
            const newCart = new Cart({
                id: v4(),
                phoneNumber,
                total: price * qty,
                items: [newDish],
            });

            await newCart.save();
            res.json({ message: "Item Added Successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete("/item/:itemId", async (req, res) => {
    const { itemId } = req.params;

    try {
        const cart = await Cart.findOne({ "items._id": itemId });

        if (!cart) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        const item = cart.items[itemIndex];

        if (itemIndex > -1) {
            cart.total -= item.price * item.qty; // Update the total
            cart.items.splice(itemIndex, 1);    // Remove the item
            await cart.save();
        }

        res.status(200).json({ message: "Item deleted successfully", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router; 