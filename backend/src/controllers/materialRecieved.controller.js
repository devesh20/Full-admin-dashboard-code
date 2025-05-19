import {MaterialRecieved} from '../models/materialRecieved.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllMaterialRecieved = asyncHandler(async (req, res) => {
    const materialRecieved = await MaterialRecieved.find()
      .populate({
        path: "postedBy",
        select: "userName", // only return userName from User
      });
  
    if (!materialRecieved || materialRecieved.length === 0) {
      return res
        .status(204)
        .json(new ApiResponse(204, {}, "No material received"));
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, materialRecieved, "Material received list"));
  });
  

const deleteMaterialRecieved = asyncHandler(async (req, res) => {
    const materialId = req.params.id;

    const deletedMaterial = await MaterialRecieved.findByIdAndDelete(materialId);

    if (!deletedMaterial) {
        throw new ApiError(404, "MaterialRecieved entry not found");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedMaterial, "MaterialRecieved entry deleted successfully")
    );
});

export {
    getAllMaterialRecieved,
    deleteMaterialRecieved
}