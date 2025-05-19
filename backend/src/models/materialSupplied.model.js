import mongoose, { Schema } from 'mongoose';

const materialSuppliedSchema = new Schema(
  {
    typeOfRotor: {
      type: String,
      required: [true, "Please add type of rotor"],
    },
    supplierName: {
      type: String,
      required: [true, "Please add supplier name"],
    },
    annexureNumber: {
      type: String,
      required: [true, "Please add annexure number"],
    },
    materialLotNumber: {
      type: Number,
      required: [true, "Please add material lot number"],
    },
    materialQuantity: {
      type: Number,
      required: [true, "Please add material quantity"],
    },
    materialQuantityKG: {
      type: Number,
      required: [true, "Please add material quantity in KG"],
    },
    locationAllocated: {
      type: String,
      required: [true, "Please add location allocated"],
    },
    weightDiscrepancy: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const MaterialSupplied = mongoose.model(
  'MaterialSupplied ',
    materialSuppliedSchema
);
