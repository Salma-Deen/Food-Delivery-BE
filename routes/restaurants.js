import express from "express";
import { v4 } from "uuid"; // Importing uuid with a different name
import Restaurant from "../models/restaurant.js"
const router = express.Router();

// POST /restaurants - Create a new restaurant
router.post("/", async (req, res) => {
  const { name, image, email, phone, address, area } = req.body;
  try {
    const newRestaurant = new Restaurant({
      name,
      image,
      email,
      phone,
      address,
      area,
      id: v4(), 
    });
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating restaurant" });
  }
});

// PUT /restaurants/:id - Update an existing restaurant
router.put("/:id", async (req, res) => {
  const { name, image, email, phone, address, area } = req.body;
  const { id } = req.params;
  try {
    const updatedRestaurant = await Restaurant.updateOne(
      { id },
      { name, image, email, phone, address, area },
      { new: true }
    );
    if (!updatedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating restaurant" });
  }
});

// GET /restaurants - Get all restaurants
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching restaurants" });
  }
});

// GET /restaurants/:id - Get a restaurant by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findOne({ id });
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching restaurant" });
  }
});

// DELETE /restaurants/:id - Delete a restaurant by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRestaurant = await Restaurant.deleteOne({ id });
    if (!deletedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting restaurant" });
  }
});

// GET /restaurants/:restaurantId/dishes?restaurantId=<id> - Get all dishes of a specific restaurant
router.get("/:restaurantId/dishes", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    // Find the restaurant by ID and return its dishes
    const restaurant = await Restaurant.findOne({ id: Number(restaurantId) });

    console.log(restaurant);

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Return the dishes array from the restaurant
    res.status(200).json(restaurant.dishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching dishes" });
  }
});

export default router; // Use export default instead of module.exports