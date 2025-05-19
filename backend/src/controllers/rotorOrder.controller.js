import { asyncHandler } from "../utils/asyncHandler.js";
import { RotorOrder } from "../models/rotorOrder.model.js";
import { rotorCycleTimes, allRotor } from "../constant.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// CREATE ROTOR ORDER
const createRotorOrder = asyncHandler(async (req, res) => {
  const { rotorType, annexureNumber, quantity } = req.body;

    console.log(req.body);
    
  if ([rotorType, annexureNumber].some(field => field?.trim() === "")) {
    throw new ApiError(400, "Rotor type and annexure number are required");
  }

  if (!allRotor.includes(rotorType)) {
    throw new ApiError(400, "Invalid rotor type");
  }

  const qty = Number(quantity);
  if (isNaN(qty) || qty <= 0) {
    throw new ApiError(400, "Quantity received must be a positive number");
  }

  const existingOrder = await RotorOrder.findOne({ annexureNumber });
  if (existingOrder) {
    throw new ApiError(409, "Order with this annexure number already exists");
  }

  const order = new RotorOrder({
    rotorType,
    annexureNumber,
    quantity: qty,
    originalQuantity: qty,
  });

  // Calculate scheduling logic
  const allPending = await RotorOrder.find({ isComplete: false }).sort({ dateOfOrder: 1 });

  let totalSeconds = 0;
  const now = new Date();

  for (const o of allPending) {
    if (o._id.equals(order._id)) break;

    const remaining = o.quantity - o.quantityProduced;
    const ct = rotorCycleTimes[o.rotorType] || 60;
    totalSeconds += remaining * ct;
  }

  const thisRemaining = qty;
  const thisCT = rotorCycleTimes[rotorType] || 60;
  totalSeconds += thisRemaining * thisCT;

  order.dateOfCompletion = new Date(now.getTime() + totalSeconds * 1000);

  await order.save();

  return res.status(201).json(
    new ApiResponse(201, order, "Rotor order created and scheduled successfully")
  );
});

// REFRESH ROTOR ORDER STATUS
const refreshRotorOrderStatus = asyncHandler(async (req, res) => {
  const pendingOrders = await RotorOrder.find({ isComplete: false }).sort({ dateOfOrder: 1 });

  let totalSeconds = 0;
  const now = new Date();

  for (const order of pendingOrders) {
    const originalQty = order.originalQuantity || order.quantity;
    const remainingQty = originalQty - order.quantityProduced;
    const cycleTime = rotorCycleTimes[order.rotorType] || 60;

    if (remainingQty <= 0) continue;

    totalSeconds += remainingQty * cycleTime;
    const expectedDate = new Date(now.getTime() + totalSeconds * 1000);

    await RotorOrder.findByIdAndUpdate(order._id, {
      dateOfCompletion: expectedDate
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Rotor order statuses refreshed"));
});

// GET ALL ROTOR ORDERS
const getAllRotorOrders = asyncHandler(async (req, res) => {
  const orders = await RotorOrder.find().sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    return res.status(204).json(
      new ApiResponse(204, {}, "No rotor orders found")
    );
  }

  return res.status(200).json(
    new ApiResponse(200, orders, "All rotor orders fetched successfully")
  );
});

export { createRotorOrder, getAllRotorOrders, refreshRotorOrderStatus };
