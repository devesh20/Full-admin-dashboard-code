import { asyncHandler } from "../utils/asyncHandler.js";
import { RotorOrder } from "../models/rotorOrder.model.js";
import { rotorCycleTimes, allRotor } from "../constant.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { RotorUtilized } from "../models/rotorUtilized.model.js";
// CREATE ROTOR ORDER
// const createRotorOrder = asyncHandler(async (req, res) => {
//   const { rotorType, annexureNumber, quantity } = req.body;

//     console.log(req.body);
    
//   if ([rotorType, annexureNumber].some(field => field?.trim() === "")) {
//     throw new ApiError(400, "Rotor type and annexure number are required");
//   }

//   if (!allRotor.includes(rotorType)) {
//     throw new ApiError(400, "Invalid rotor type");
//   }

//   const qty = Number(quantity);
//   if (isNaN(qty) || qty <= 0) {
//     throw new ApiError(400, "Quantity received must be a positive number");
//   }

//   const existingOrder = await RotorOrder.findOne({ annexureNumber });
//   if (existingOrder) {
//     throw new ApiError(409, "Order with this annexure number already exists");
//   }

//   const order = new RotorOrder({
//     rotorType,
//     annexureNumber,
//     quantity: qty,
//     originalQuantity: qty,
//   });

//   // Calculate scheduling logic
//   const allPending = await RotorOrder.find({ isComplete: false }).sort({ dateOfOrder: 1 });

//   let totalSeconds = 0;
//   const now = new Date();

//   for (const o of allPending) {
//     if (o._id.equals(order._id)) break;

//     const remaining = o.quantity - o.quantityProduced;
//     const ct = rotorCycleTimes[o.rotorType] || 60;
//     totalSeconds += remaining * ct;
//   }

//   const thisRemaining = qty;
//   const thisCT = rotorCycleTimes[rotorType] || 60;
//   totalSeconds += thisRemaining * thisCT;

//   order.dateOfCompletion = new Date(now.getTime() + totalSeconds * 1000);

//   await order.save();

//   return res.status(201).json(
//     new ApiResponse(201, order, "Rotor order created and scheduled successfully")
//   );
// });


const createRotorOrder = asyncHandler(async (req, res) => {
  const { rotorType, annexureNumber, quantity } = req.body;
  console.log(req.body);

  // Validation
  if ([rotorType, annexureNumber].some(field => field?.trim() === "")) {
    throw new ApiError(400, "Rotor type and annexure number are required");
  }

  if (!allRotor.includes(rotorType)) {
    throw new ApiError(400, "Invalid rotor type");
  }

  const existingOrder = await RotorOrder.findOne({ annexureNumber });
  if (existingOrder) {
    throw new ApiError(409, "Order with this annexure number already exists");
  }

  // Convert quantity to number
  const reqQty = Number(quantity);
  if (isNaN(reqQty) || reqQty <= 0) {
    throw new ApiError(400, "Quantity must be a valid positive number");
  }

  // Check rotor utilization
  const utilized = await RotorUtilized.findOne({ typeOfRotor: rotorType });
  const qtyAvailable = utilized?.materialQuantity > 0 ? utilized.materialQuantity : 0;

  // Calculate how much can be produced
  const qtyProducedNow = Math.min(reqQty, qtyAvailable);      // cannot exceed requested
  const qtyStillPending = Math.max(reqQty - qtyAvailable, 0); // avoid negative
  const isComplete = qtyStillPending === 0;

  const order = new RotorOrder({
    rotorType,
    annexureNumber,
    originalQuantity: reqQty,
    quantityProduced: qtyProducedNow,
    quantity: qtyStillPending,
    isComplete,
  });

  // Scheduling logic (for all pending orders before this one)
  const allPending = await RotorOrder
    .find({ isComplete: false })
    .sort({ dateOfOrder: 1 })
    .lean(); // better performance

  let totalSeconds = 0;
  for (const o of allPending) {
    const remaining = Number(o.quantity) || 0;
    const ct = rotorCycleTimes[o.rotorType] || 60;
    totalSeconds += remaining * ct;
  }

  // Add new order’s remaining time
  totalSeconds += qtyStillPending * (rotorCycleTimes[rotorType] || 60);

  // Final date calculation
  order.dateOfCompletion = new Date(Date.now() + totalSeconds * 1000);

  await order.save();

  return res.status(201).json(
    new ApiResponse(201, order, "Rotor order created successfully")
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
