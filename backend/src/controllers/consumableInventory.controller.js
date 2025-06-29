import { ConsumablesInventory } from '../models/consumableInventory.model.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET all consumables inventory
const getConsumablesInventoryData = asyncHandler(async (req, res) => {
  const data = await ConsumablesInventory.find();

  console.log(data)
  if (!data || data.length === 0) {
    throw new ApiError(404, "No consumables inventory data found");
  }
  
  return res.status(200).json(
    new ApiResponse(200, data, "All Consumables Inventory Data")
  );
});

// UPDATE consumables inventory limit
const updateConsumablesInventoryLimit = asyncHandler(async (req, res) => {
  const { itemName, limit } = req.body;
  
  if (!itemName || !limit) {
    throw new ApiError(400, "Item name and limit are required");
  }

  const inventory = await ConsumablesInventory.findOne({ itemName });
  
  if (!inventory) {
    throw new ApiError(404, "Consumables inventory item not found for this item name");
  }

  inventory.limit = limit;
  await inventory.save();

  return res.status(200).json(
    new ApiResponse(200, inventory, "Consumables inventory limit updated successfully")
  );
});

export {
  getConsumablesInventoryData,
  updateConsumablesInventoryLimit
};
