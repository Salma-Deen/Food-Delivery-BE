import express from "express";
import Address from "../models/address.js"; // Ensure the path ends with .js
import { v4 } from "uuid"; // Importing uuid with a different name

const router = express.Router();

// API endpoint to update address
router.patch("/change/:id", async (req, res) => {
    const { id } = req.params;
    const { street, city, state, zip, country, addressType } = req.body; // Include addressType

    try {
        const updatedAddress = await Address.findByIdAndUpdate(
            id,
            { street, city, state, zip, country, addressType }, // Update addressType
            { new: true, runValidators: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({ message: 'Address updated successfully', updatedAddress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

