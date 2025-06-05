import mongoose, { Schema } from "mongoose";

const RotorUtilizedSchema = new Schema({
  typeOfRotor: {
    type: String,
    required: [true, 'Rotor type is required']
  },

  materialQuantity:{
    type: Number,
    required: [true, 'Quantity received is required']
  },
  materialQuantityKG: {
    type: Number,
    default: 0
  },
  postedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }

}, { timestamps: true });

export const RotorUtilized = mongoose.model('RotorUtilized', RotorUtilizedSchema);
