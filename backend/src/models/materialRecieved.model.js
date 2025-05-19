import mongoose,{Schema} from 'mongoose'

const materialRecievedSchema = new Schema(
    {
      materialGrade: {
        type: String,
        required: [true, "please add material grade"],
      },
      supplierName: {
        type: String,
        required: [true, "please add supplier name"],
      },
      purchaseOrderNumber: {
        type: String,
        required: [true, "please add purchase order number"],
      },
      challanNumber: {
        type: String,
        required: [true, "please add challan number"],
      },
      materialLotNumber: {
        type: Number,
        required: [true, "please add material lot number"],
      },
      materialQuantity: {
        type: Number,
        required: [true, "please add material quantity"],
      },
      materialQuantityKG: {
        type: Number,
        required: [true, "please add material quantity in KG"],
      },
      locationAllocated: {
        type: String,
        required: [true, "please add location allocated"],
      },
      weightDiscrepancy: {
        type: Number,
      },
      postedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
    { timestamps: true }
  );

  export const MaterialRecieved = mongoose.model('MaterialRecieved',materialRecievedSchema)