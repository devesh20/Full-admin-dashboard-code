import mongoose,{Schema} from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, "please add name"],
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: [true, "please add phone number"],
        unique: true,
      },
      password: {
        type: String,
        required: [true, "please add password"],
        min: 6,
        max: 64,
      },
      jobType: {
        type: String,
        enum: ["Inventory", "Die Casting", "Shot Blasting", "Flatling"],
        required: true,
      },
      // aadhaarNo:{
      //   type: String,
      //   required:[true,'please add aadhaar number']
      // }
},{timestamps:true})

//hooks
userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

//methods
userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}


export const User = mongoose.model('User',userSchema)