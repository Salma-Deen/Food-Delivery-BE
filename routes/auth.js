import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Ensure the path is correct and ends with .js

const router = express.Router();

// POST /auth/sign-up
router.post("/sign-up", async (req, res) => {
  const { fullName, phoneNumber, email } = req.body;

  try {
    // Create a new user document from the incoming request body
    const newUser = new User({
      fullName,
      phoneNumber,
      email,
    });

    // Save the user to MongoDB
    const savedUser = await newUser.save();

    // Return the saved user data
    res.status(201).json({ msg: "User  signed up successfully!", user: savedUser });
  } catch (error) {
    // Handle any errors, such as duplicate phone numbers
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ msg: "Phone number already exists" });
    }
    res.status(500).json({ msg: "Server error" });
  }
});

// POST /auth/sign-in (new route for sign-in)
router.post("/sign-in", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ msg: "Phone number is required" });
  }

  // Simulate sign-in logic without database interaction
  const userObj = await User.findOne({ phoneNumber });

  const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  if (userObj) {
    res.status(200).json({ msg: "Signed in successfully", userDetails: userObj, token });
  } else {
    res.status(404).json({ msg: "Phone Number is Not Found" });
  }
});

export default router;