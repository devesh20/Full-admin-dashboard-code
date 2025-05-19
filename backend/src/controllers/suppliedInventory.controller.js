import { SuppliedInventory } from '../models/suppliedInventory.model.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getSuppliedInventoryData = asyncHandler(async (req, res) => {
  const data = await SuppliedInventory.find();

  if (!data || data.length === 0) {
    throw new ApiError(404, "No rotor inventory data found");
  }

  return res.status(200).json(
    new ApiResponse(200, data, "All Rotor Inventory Data")
  );
});

export {
  getSuppliedInventoryData
};
