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

const updateSuppliedInventoryLimit = asyncHandler(async (req, res) => {
  const { rotorType, limit } = req.body;
  
  if (!rotorType || !limit) {
    throw new ApiError(400, "Rotor type and limit are required");
  }

  const inventory = await SuppliedInventory.findOne({ rotorType });
  
  if (!inventory) {
    throw new ApiError(404, "Supplied inventory item not found for this rotor type");
  }

  inventory.limit = limit;
  await inventory.save();

  return res.status(200).json(
    new ApiResponse(200, inventory, "Supplied inventory limit updated successfully")
  );
});

export {
  getSuppliedInventoryData,
  updateSuppliedInventoryLimit
};
