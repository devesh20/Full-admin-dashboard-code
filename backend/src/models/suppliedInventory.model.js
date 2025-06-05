import mongoose, { Schema } from 'mongoose';

const suppliedInventorySchema = new Schema({
  rotorType: {
    type: String,
    required: [true, "Rotor type is required"]
  },
  quantity: {
    type: Number,
    required: [true, "Rotor quantity is required"]
  },
  limit: {
    type: Number,
    default: 10
  }
}, { timestamps: true });

export const SuppliedInventory = mongoose.model('SuppliedInventory', suppliedInventorySchema);
