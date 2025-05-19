import mongoose,{Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const adminSchema = new Schema({
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
        default:"admin"
      },
      aadhaarNo:{
        type: String,
        default: ""
      },
      isOwner:{
        type:Boolean,
        required:[true,'please select owner field'],
        default:false
      }
},{timestamps:true})

//hooks
adminSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

//methods
adminSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
        _id: this._id,
        phoneNumber: this.phoneNumber,
        userName: this.userName,
        jobType: this.jobType
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}
adminSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}


export const Admin = mongoose.model('Admin',adminSchema)