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

const updateInventoryLimit = asyncHandler(async (req, res) => {
    const { materialGrade, limit } = req.body;
    
    if (!materialGrade || !limit) {
        throw new ApiError(400, "Material grade and limit are required");
    }

    const inventory = await Inventory.findOne({ materialGrade });
    
    if (!inventory) {
        throw new ApiError(404, "Inventory item not found for this material grade");
    }

    inventory.limit = limit;
    await inventory.save();

    return res.status(200).json(
        new ApiResponse(200, inventory, "Inventory limit updated successfully")
    );
});

export {
    getInventoryData,
    updateInventoryLimit
}