import mongoose from "mongoose";

const CartItem = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: false },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    restrauntId: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    items: [CartItem],
});

// Create the Cart model
const Cart = mongoose.model("Cart", cartSchema, "cart");

// Export the Cart model
export default Cart;