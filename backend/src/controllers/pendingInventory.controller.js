import {PendingInventory} from "../models/pendingInventory.model.js"
import { Inventory } from "../models/inventory.model.js";
import { MaterialRecieved } from "../models/materialRecieved.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";


// GET all PendingInventory entries with user name
 const getAllPendingInventory = asyncHandler(async (req, res) => {
    const items = await PendingInventory.find().populate("postedBy", "userName");
  
    if (!items || items.length === 0) {
      console.warn("No pending inventory entries found.");
    }
  
    return res.status(200).json(
      new ApiResponse(200, items, "Pending inventory entries fetched successfully")
    );
  });
  
const getPendingInventoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await PendingInventory.findById(id).populate("postedBy", "name");
  
    if (!item) {
      return res.status(404).json(new ApiResponse(404, null, "Inventory entry not found"));
    }
  
    return res.status(200).json(
      new ApiResponse(200, item, "Inventory entry fetched successfully")
    );
  });
  
const updatePendingInventory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existingItem = await PendingInventory.findById(id).populate("postedBy", "name");
  
    if (!existingItem) {
      return res.status(404).json(new ApiResponse(404, null, "Inventory entry not found"));
    }
  
    const updatedItem = await PendingInventory.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("postedBy", "name");
  
    return res.status(200).json(
      new ApiResponse(
        200,
        { previousData: existingItem, updatedData: updatedItem },
        "Inventory entry updated successfully"
      )
    );
  });

  // CONFIRM a pending inventory entry
 const confirmPendingInventory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log("hi pending");
    
    // 1. Find the pending entry
    const pendingEntry = await PendingInventory.findById(id);
  
    if (!pendingEntry) {
      return res.status(404).json(new ApiResponse(404, null, "Pending entry not found"));
    }
  
    // 2. Create a new MaterialReceived document from pendingEntry
    const received = await MaterialRecieved .create({
      materialGrade: pendingEntry.materialGrade,
      supplierName: pendingEntry.supplierName,
      purchaseOrderNumber: pendingEntry.purchaseOrderNumber,
      challanNumber: pendingEntry.challanNumber,
      materialLotNumber: pendingEntry.materialLotNumber,
      materialQuantity: pendingEntry.materialQuantity,
      materialQuantityKG: pendingEntry.materialQuantityKG,
      locationAllocated: pendingEntry.locationAllocated,
      weightDiscrepancy: pendingEntry.weightDiscrepancy,
      postedBy: pendingEntry.postedBy,
    });
    // console.log("confirm pending order")
    // 3. Update or create Inventory based on materialGrade
    const inventory = await Inventory.findOne({ materialGrade: pendingEntry.materialGrade });
  
    if (inventory) {
      inventory.materialQuantity += pendingEntry.materialQuantity;
      await inventory.save();
    } else {
      await Inventory.create({
        materialGrade: pendingEntry.materialGrade,
        materialQuantity: pendingEntry.materialQuantity,
        limit: 20, // Or set a default or from config
      });
    }
  
    // 4. Delete the pending entry
    await PendingInventory.findByIdAndDelete(id);
  
    // 5. Respond with success
    return res.status(200).json(
      new ApiResponse(200, received, "Inventory confirmed, added to material received, and updated in inventory.")
    );
  });

  const deletePendingInventory = asyncHandler(async (req, res) => {
    const pendingInventoryId = req.params.id;

    const deletedPendingInventory = await PendingInventory.findByIdAndDelete(pendingInventoryId);

    if (!deletedPendingInventory) {
        throw new ApiError(404, "Pending Inventory entry not found");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedPendingInventory, "Pending Inventory entry deleted successfully")
    );
});

  export{updatePendingInventory,getPendingInventoryById,getAllPendingInventory, confirmPendingInventory, deletePendingInventory}