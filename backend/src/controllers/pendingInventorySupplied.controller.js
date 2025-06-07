import { PendingInventorySupplied } from "../models/pendingInventorySupplied.model.js";
import { SuppliedInventory } from "../models/suppliedInventory.model.js";
import { MaterialSupplied } from "../models/materialSupplied.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET all PendingInventorySupplied entries with user name
const getAllPendingInventorySupplied = asyncHandler(async (req, res) => {
  const items = await PendingInventorySupplied.find().populate("postedBy", "userName");

  if (!items || items.length === 0) {
    console.warn("No pending supplied inventory entries found.");
  }

  return res.status(200).json(
    new ApiResponse(200, items, "Pending supplied inventory entries fetched successfully")
  );
});

// GET single PendingInventorySupplied entry by ID
const getPendingInventorySuppliedById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await PendingInventorySupplied.findById(id).populate("postedBy", "name");

  if (!item) {
    return res.status(404).json(new ApiResponse(404, null, "Supplied inventory entry not found"));
  }

  return res.status(200).json(
    new ApiResponse(200, item, "Supplied inventory entry fetched successfully")
  );
});

// UPDATE PendingInventorySupplied entry
const updatePendingInventorySupplied = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingItem = await PendingInventorySupplied.findById(id).populate("postedBy", "name");

  if (!existingItem) {
    return res.status(404).json(new ApiResponse(404, null, "Supplied inventory entry not found"));
  }

  const updatedItem = await PendingInventorySupplied.findByIdAndUpdate(id, req.body, {
    new: true,
  }).populate("postedBy", "name");

  return res.status(200).json(
    new ApiResponse(
      200,
      { previousData: existingItem, updatedData: updatedItem },
      "Supplied inventory entry updated successfully"
    )
  );
});

// CONFIRM a pending inventory supplied entry
const confirmPendingInventorySupplied = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pendingEntry = await PendingInventorySupplied.findById(id);

  if (!pendingEntry) {
    return res.status(404).json(new ApiResponse(404, null, "Pending supplied entry not found"));
  }

  // Create a new MaterialSupplied document
  const supplied = await MaterialSupplied.create({
    typeOfRotor: pendingEntry.typeOfRotor,
    supplierName: pendingEntry.supplierName,
    annexureNumber: pendingEntry.annexureNumber,
    materialLotNumber: pendingEntry.materialLotNumber,
    materialQuantity: pendingEntry.materialQuantity,
    materialQuantityKG: pendingEntry.materialQuantityKG,
    locationAllocated: pendingEntry.locationAllocated,
    weightDiscrepancy: pendingEntry.weightDiscrepancy,
    postedBy: pendingEntry.postedBy,
  });

  // Update or create SuppliedInventory instead of Inventory
  const inventory = await SuppliedInventory.findOne({ rotorType: pendingEntry.typeOfRotor });

  if (inventory) {
    inventory.quantity += pendingEntry.materialQuantity;
    await inventory.save();
  } else {
    await SuppliedInventory.create({
      rotorType: pendingEntry.typeOfRotor,
      quantity: pendingEntry.materialQuantity,
      limit: 20, // Set a default limit or adjust as needed
    });
  }

  // Delete the pending entry after confirmation
  await PendingInventorySupplied.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(
      200,
      supplied,
      "Supplied inventory confirmed, added to material supplied, and updated in supplied inventory."
    )
  );
});

// DELETE PendingInventorySupplied entry
const deletePendingInventorySupplied = asyncHandler(async (req, res) => {
  const pendingInventoryId = req.params.id;

  const deletedPendingInventory = await PendingInventorySupplied.findByIdAndDelete(pendingInventoryId);

  if (!deletedPendingInventory) {
    throw new ApiError(404, "Pending supplied inventory entry not found");
  }

  return res.status(200).json(
    new ApiResponse(200, deletedPendingInventory, "Pending supplied inventory entry deleted successfully")
  );
});

export {
  getAllPendingInventorySupplied,
  getPendingInventorySuppliedById,
  updatePendingInventorySupplied,
  confirmPendingInventorySupplied,
  deletePendingInventorySupplied,
};
