import mongoose,{Schema} from 'mongoose'

const inventorySchema  = new Schema({
    materialQuantity:{
        type:Number,
        required:true
    },
    materialGrade:{
        type:String
    },
    limit:{
        type:Number,
        default:10
    }
},{timestamps:true})

export const Inventory = mongoose.model('Inventory',inventorySchema)