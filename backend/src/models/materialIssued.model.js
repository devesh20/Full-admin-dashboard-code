import mongoose,{Schema} from 'mongoose'

const materialIssuedSchema = new Schema(
    {
        materialGrade: {
          type: String,
          required: [true, "please add material grade"],
        },
        locationOfMaterial: {
          type: String,
          required: [true, "please add location allocated"],
        },
        shiftOfProduction: {
          type: String,
          required: [true, "please add shift of production"],
        },
        materialQuantity: {
          type: Number,
          required: [true, "please add material quantity"],
        },
        materialQuantityKG: {
          type: Number,
          required: [true, "please add material quantity in KG"],
        },
    
        postedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
      { timestamps: true }
  );

  export const MaterialIssued = mongoose.model('MaterialIssued',materialIssuedSchema)