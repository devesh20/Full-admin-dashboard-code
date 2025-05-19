import mongoose,{Schema} from 'mongoose'

const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, "please add name"],
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: [true, "please add phone number"],
        // unique: true, just for development purpose
      },
      jobType: {
        type: String,
        enum: ["Inventory", "Die Casting", "Shot Blasting", "Flatling","admin"],
        required: true,
      },
},{timestamps:true})


export const PreviousUser = mongoose.model('PreviousUser',userSchema)