// models/Address.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
   addressType: { type: String, enum: ['Home', 'Work'], required: true }, // New field
});

const Address = mongoose.model('Address', addressSchema);

export default Address;