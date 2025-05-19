import mongoose, { Schema } from "mongoose";

const RotorOrderSchema = new Schema({
  rotorType: {
    type: String,
    required: [true, 'Rotor type is required']
  },
  annexureNumber: {
    type: String,
    required: [true, 'Annexure number is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity received is required']
  },
  quantityProduced: {
    type: Number,
    default: 0
  },
  originalQuantity: Number,
  dateOfOrder: {
    type: Date,
    default: Date.now
  },
  dateOfCompletion: {
    type: Date,
    default: Date.now
  },
  isComplete: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const RotorOrder = mongoose.model('RotorOrder', RotorOrderSchema);
