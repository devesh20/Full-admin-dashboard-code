import mongoose, { Schema } from "mongoose";
import { Diecasting } from "./diecasting.model.js";
import { CastingUtilized } from './castingUtilized.model.js';
import { partDetails, castingDetails } from '../constant.js';

// Define allowed part numbers for dropdown
const allowedPartNumbers = Object.values(partDetails);

const OrderSchema = new Schema({
  partNumber: {
    type: String,
    enum: {
      values: allowedPartNumbers,
      message: 'Invalid part number. Must be one of: ' + allowedPartNumbers.join(', ')
    },
    required: [true, 'Part number is required']
  },
  partName: {
    type: String
  },
  poNumber: {
    type: String,
    required: [true, 'PO number is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required']
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
  },
  castingName: {
    type: String
  }
}, { timestamps: true });

// hook to auto-fill partName, castingName and set quantityProduced


// OrderSchema.pre('save', async function (next) {
//   try {
//     const partName = partDetails[this.partNumber];
//     if (!partName) return next(new Error(`Part number "${this.partNumber}" is not recognized.`));
//     this.partName = partName;

//     const castingName = castingDetails[this.partNumber];
//     if (!castingName) {
//       console.log("Available castingDetails:", castingDetails);
//       return next(new Error(`No casting name mapped for part number "${this.partNumber}".`));
//     }
//     this.castingName = castingName;

//     const matchingCastings = await Diecasting.find({ castingName });

//     let orderRemaining = this.quantity;
//     let totalUsed = 0;

//     for (const casting of matchingCastings) {
//       if (orderRemaining <= 0) break;

//       const availableQty = casting.quantityProduced || 0;
//       if (availableQty <= 0) continue;

//       const qtyToUse = Math.min(orderRemaining, availableQty);
//       totalUsed += qtyToUse;
//       orderRemaining -= qtyToUse;

//       await CastingUtilized.create({
//         castingName: casting.castingName,
//         quantityUsed: qtyToUse,
//         quantityProducedKG: casting.quantityProducedKG,
//         shiftOfProduction: casting.shiftOfProduction,
//         machineNumber: casting.machineNumber,
//         furnaceTemperature: casting.furnaceTemperature,
//         dyeTemperature: casting.dyeTemperature,
//         quantityRejected: casting.quantityRejected,
//         rejectionCause: casting.rejectionCause,
//         timeToFix: casting.timeToFix,
//         machineDefectCause: casting.machineDefectCause,
//         imageUrl: casting.imageUrl,
//         postedBy: casting.postedBy,
//         poNumber: this.poNumber 
//       });

//       const leftover = availableQty - qtyToUse;
//       if (leftover <= 0) {
//         await Diecasting.findByIdAndDelete(casting._id);
//       } else {
//         await Diecasting.findByIdAndUpdate(casting._id, {
//           quantityProduced: leftover
//         });
//       }
//     }

//     this.quantityProduced = totalUsed;
//     this.isComplete = this.quantityProduced >= this.quantity;

//     next();
//   } catch (error) {
//     console.error("Error in OrderSchema pre-save:", error);
//     next(error);
//   }
// });


export const Order = mongoose.model('Order', OrderSchema);
