import mongoose from "mongoose";

const CartItem = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  qty: { type: Number, required: true },
  restrauntId: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
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

const Order = mongoose.model("order", orderSchema, "orders");

export default Order;