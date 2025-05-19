import mongoose from "mongoose"

//schema
const dieCastingSchema = new mongoose.Schema(
    {
      castingName: {
        type: String,
        required: [true, "please add casting name"],
      },
      quantityProduced: {
        type: Number,
        required: [true, "please add quantity produced"],
      },
      quantityProducedKG: {
        type: Number,
        required: [true, "please add quantity produced in KG"],
      },
      shiftOfProduction: {
        type: String,
        required: [true, "please add shift of production"],
      },
      machineNumber: {
        type: String,
        required: [true, "please add machine number"],
      },
      furnaceTemperature: {
        type: Number,
        required: [true, "please add machine temperature"],
      },
      dyeTemperature: {
        type: Number,
        required: [true, "please add dye temperature"],
      },
      quantityRejected: {
        type: Number,
        required: [true, "please add quantity rejected"],
      },
      rejectionCause: {
        type: String,
        required: [true, "please add cause"],
      },
      timeToFix: {
        type: Number,
        required: [true, "please add time required to fix"],
      },
      machineDefectCause: {
        type: String,
        required: [true, "please add cause"],
      },
      imageUrl: { type: String },
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    { timestamps: true }
  );

export const Diecasting = mongoose.model('Diecasting',dieCastingSchema)