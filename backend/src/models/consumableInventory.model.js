import mongoose from "mongoose";

//schema
const ConsumablesInventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "please add item name"],
    },
    consumablesQuantity: {
      type: Number,
      required: [true, "please add consumables quantity"],
    },
    limit: {
      type: Number,
      default: 20,
    },
  },
  { timestamps: true }
);

export const ConsumablesInventory = mongoose.model('ConsumablesInventory',ConsumablesInventorySchema)