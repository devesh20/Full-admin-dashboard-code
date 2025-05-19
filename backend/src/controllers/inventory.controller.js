import {Inventory} from '../models/inventory.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const getInventoryData = asyncHandler( async (req,res)=>{
    const data = await Inventory.find()
    // console.log(data)
    if(!data){
        throw new ApiError(404,"Error while getting Inventory data");
    }

    return res.status(201).json(
       new ApiResponse(200,data,"All Inventory Data")
    )
})

export {
    getInventoryData
}