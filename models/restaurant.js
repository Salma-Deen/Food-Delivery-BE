import mongoose from "mongoose";

// Define the dish schema
const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

// Define the restaurant schema with embedded dishes
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  area: { type: String, required: true },
  dishes: [dishSchema], // Add dishes as an array of dishSchema
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema, "restaurants");

export default Restaurant;
