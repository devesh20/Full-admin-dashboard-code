import mongoose, { Schema } from "mongoose";

const PendingOrderSchema = new Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  expectedCompletionDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const PendingOrder = mongoose.model("PendingOrder", PendingOrderSchema);
