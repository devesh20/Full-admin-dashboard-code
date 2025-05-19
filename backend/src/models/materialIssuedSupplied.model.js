import mongoose, { Schema } from 'mongoose';

const materialIssuedSuppliedSchema = new Schema(
  {
    typeOfRotor: {
      type: String,
      required: [true, 'please add type of rotor'],
    },
    materialQuantity: {
      type: Number,
      required: [true, 'please add material quantity'],
    },
    materialQuantityKG: {
      type: Number,
      required: [true, 'please add material quantity in KG'],
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const MaterialIssuedSupplied = mongoose.model(
  'MaterialIssuedSupplied',
  materialIssuedSuppliedSchema
);
