import { ConsumablesInventory } from '../models/consumableInventory.model.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET all consumables inventory
const getConsumablesInventoryData = asyncHandler(async (req, res) => {
  const data = await ConsumablesInventory.find();

  if (!data || data.length === 0) {
    throw new ApiError(404, "No consumables inventory data found");
  }

  return res.status(200).json(
    new ApiResponse(200, data, "All Consumables Inventory Data")
  );
});

export {
  getConsumablesInventoryData
};
