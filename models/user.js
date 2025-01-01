import mongoose from "mongoose"; // Import mongoose

// Define the user schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
 email:{ type: String, required: true, unique: true }
});

// Create the User model
const User = mongoose.model("User ", userSchema, "users");

export default User;