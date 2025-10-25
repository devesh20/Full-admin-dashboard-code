import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { Diecasting } from "../models/diecasting.model.js";
import { partDetails, castingDetails,cycleTimes } from "../constant.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { CastingUtilized } from "../models/castingUtilized.model.js";
import fs from "fs";
import path from "path";

function getCycleTimes() {
  const filePath = path.join(path.resolve(), "src/data/cycleTimes.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return data.cycleTimes;
}


// const createOrder = asyncHandler(async (req, res) => {
//   const { partNumber, partName, poNumber, quantity } = req.body;

//   console.log("Received order:", { partNumber, partName, poNumber, quantity });

//   // Validate required fields
//   if ([partNumber, poNumber].some(field => field.trim() === "")) {
//     throw new ApiError(400, "Part number and PO number are required");
//   }

//   if (partNumber === "PYRO" && (!partName || partName.trim() === "")) {
//     throw new ApiError(400, "Part name is required for PYRO");
//   }

//   const qty = Number(quantity);
//   if (isNaN(qty) || qty <= 0) {
//     throw new ApiError(400, "Quantity must be a positive number");
//   }

//   const existingOrder = await Order.findOne({ poNumber });
//   if (existingOrder) {
//     throw new ApiError(409, "Order with this PO number already exists");
//   }

//   const order = await Order.create({
//     partNumber,
//     partName: partName || null, // store null for non-PYRO parts
//     poNumber,
//     quantity: qty,
//   });

//   if (!order) {
//     throw new ApiError(500, "Something went wrong while creating the order");
//   }

//   return res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
// });


// const createOrder = asyncHandler(async (req, res) => {
//   const { partNumber, partName, poNumber, quantity } = req.body;

//   console.log(req.body);

//   if ([partNumber, poNumber].some(field => field?.trim() === "")) {
//     throw new ApiError(400, "Part number and PO number are required");
//   }

//   if (partNumber === "PYRO" && (!partName || partName.trim() === "")) {
//     throw new ApiError(400, "Part name is required for PYRO");
//   }

//   const qty = Number(quantity);
//   if (isNaN(qty) || qty <= 0) {
//     throw new ApiError(400, "Quantity must be a positive number");
//   }

//   const existingOrder = await Order.findOne({ poNumber });
//   if (existingOrder) {
//     throw new ApiError(409, "Order with this PO number already exists");
//   }

//   const resolvedPartName = partNumber === "PYRO" ? partName : partDetails[partNumber];
//   const castingName = castingDetails[partNumber];
//   if (!resolvedPartName || !castingName) {
//     throw new ApiError(400, "Invalid part number or casting name not found");
//   }

//   const order = new Order({
//     partNumber,
//     partName: resolvedPartName,
//     poNumber,
//     quantity: qty,                // Remaining quantity
//     originalQuantity: qty,        // Original quantity input
//     castingName,
//   });

//   // Handle casting utilization
//   const matchingCastings = await Diecasting.find({ castingName });

//   let orderRemaining = qty;
//   let totalUsed = 0;

//   for (const casting of matchingCastings) {
//     if (orderRemaining <= 0) break;

//     const availableQty = casting.quantityProduced || 0;
//     if (availableQty <= 0) continue;

//     const qtyToUse = Math.min(orderRemaining, availableQty);
//     totalUsed += qtyToUse;
//     orderRemaining -= qtyToUse;

//     // Create a CastingUtilized record
//     await CastingUtilized.create({
//       castingName: casting.castingName,
//       quantityUsed: qtyToUse,
//       quantityProducedKG: casting.quantityProducedKG,
//       shiftOfProduction: casting.shiftOfProduction,
//       machineNumber: casting.machineNumber,
//       furnaceTemperature: casting.furnaceTemperature,
//       dyeTemperature: casting.dyeTemperature,
//       quantityRejected: casting.quantityRejected,
//       rejectionCause: casting.rejectionCause,
//       timeToFix: casting.timeToFix,
//       machineDefectCause: casting.machineDefectCause,
//       imageUrl: casting.imageUrl,
//       postedBy: casting.postedBy,
//       poNumber: poNumber,
//     });

//     // Deduct the used quantity from the Diecasting
//     const leftover = availableQty - qtyToUse;
//     if (leftover <= 0) {
//       // If all quantity is used, delete the Diecasting entry
//       await Diecasting.findByIdAndDelete(casting._id);
//     } else {
//       // If there's leftover, update the Diecasting entry
//       await Diecasting.findByIdAndUpdate(casting._id, {
//         quantityProduced: leftover,
//       });
//     }
//   }


//   order.quantityProduced = totalUsed;
//   order.quantity= qty - totalUsed;
//   order.isComplete = totalUsed >= qty;

//   // Queue logic: calculate expected completion date based on current and prior pending orders
//   const allPending = await Order.find({ isComplete: false }).sort({ dateOfOrder: 1 });

//   let totalSeconds = 0;
//   const now = new Date();

//   for (const o of allPending) {
//     if (o._id.equals(order._id)) break;

//     const remaining = o.quantity - o.quantityProduced;
//     const ct = cycleTimes[o.castingName] || 60;
//     totalSeconds += remaining * ct;
//   }

//   const thisRemaining = qty - totalUsed;
//   const thisCT = cycleTimes[castingName] || 60;
//   totalSeconds += thisRemaining * thisCT;

//   order.dateOfCompletion = new Date(now.getTime() + totalSeconds * 1000);

//   await order.save();

//   return res.status(201).json(
//     new ApiResponse(201, order, "Order created and scheduled successfully")
//   );
// });



const createOrder = asyncHandler(async (req, res) => {
  const { partName, poNumber, quantity } = req.body;

  console.log(req.body);

  if ([partName, poNumber].some(field => field?.trim() === "")) {
    throw new ApiError(400, "Part name and PO number are required");
  }

  const qty = Number(quantity);
  if (isNaN(qty) || qty <= 0) {
    throw new ApiError(400, "Quantity must be a positive number");
  }

  const existingOrder = await Order.findOne({ poNumber });
  if (existingOrder) {
    throw new ApiError(409, "Order with this PO number already exists");
  }

  const partNumber = partDetails[partName];
  const castingName = castingDetails[partName];

  if (!partNumber || !castingName) {
    throw new ApiError(400, "Invalid part name or casting not found");
  }

  const order = new Order({
    partNumber,
    partName,
    poNumber,
    quantity: qty,
    originalQuantity: qty,
    castingName,
  });

  // Handle casting utilization
  const matchingCastings = await Diecasting.find({ castingName });

  let orderRemaining = qty;
  let totalUsed = 0;

  for (const casting of matchingCastings) {
    if (orderRemaining <= 0) break;

    const availableQty = casting.quantityProduced || 0;
    if (availableQty <= 0) continue;

    const qtyToUse = Math.min(orderRemaining, availableQty);
    totalUsed += qtyToUse;
    orderRemaining -= qtyToUse;

    await CastingUtilized.create({
      castingName: casting.castingName,
      quantityUsed: qtyToUse,
      quantityProducedKG: casting.quantityProducedKG,
      shiftOfProduction: casting.shiftOfProduction,
      machineNumber: casting.machineNumber,
      furnaceTemperature: casting.furnaceTemperature,
      dyeTemperature: casting.dyeTemperature,
      quantityRejected: casting.quantityRejected,
      rejectionCause: casting.rejectionCause,
      timeToFix: casting.timeToFix,
      machineDefectCause: casting.machineDefectCause,
      imageUrl: casting.imageUrl,
      postedBy: casting.postedBy,
      poNumber: poNumber,
    });

    const leftover = availableQty - qtyToUse;
    if (leftover <= 0) {
      await Diecasting.findByIdAndDelete(casting._id);
    } else {
      await Diecasting.findByIdAndUpdate(casting._id, {
        quantityProduced: leftover,
      });
    }
  }

  order.quantityProduced = totalUsed;
  order.quantity = qty - totalUsed;
  order.isComplete = totalUsed >= qty;

  // Queue logic for dateOfCompletion
  const allPending = await Order.find({ isComplete: false }).sort({ dateOfOrder: 1 });

  let totalSeconds = 0;
  const now = new Date();

  for (const o of allPending) {
    if (o._id.equals(order._id)) break;

    const remaining = o.quantity - o.quantityProduced;
    // const ct = cycleTimes[o.castingName] || 60;
    const ct = getCycleTimes()[o.castingName] || 60;
    totalSeconds += remaining * ct;
  }

  const thisRemaining = qty - totalUsed;
  // const thisCT = cycleTimes[castingName] || 60;
  const thisCT = getCycleTimes()[castingName] || 60;
  totalSeconds += thisRemaining * thisCT;

  order.dateOfCompletion = new Date(now.getTime() + totalSeconds * 1000);

  await order.save();

  return res.status(201).json(
    new ApiResponse(201, order, "Order created and scheduled successfully")
  );
});



const refreshOrderStatus = asyncHandler(async (req, res) => {
  const pendingOrders = await Order.find({ isComplete: false }).sort({ dateOfOrder: 1 });

  const allCastings = await Diecasting.find({}).sort({ createdAt: 1 }); // sort oldest first
  const castingMap = {}; // { castingName: [castings] }

  // Organize castings by castingName
  for (const casting of allCastings) {
    if (!castingMap[casting.castingName]) {
      castingMap[casting.castingName] = [];
    }
    castingMap[casting.castingName].push(casting);
  }

  let totalSeconds = 0;
  const now = new Date();

  for (const order of pendingOrders) {
    const originalQty = order.originalQuantity || order.quantity;
    let quantityProduced = 0;
    const remainingQty = originalQty - order.quantityProduced;
    // const cycleTime = cycleTimes[order.castingName] || 60;
    const cycleTime = getCycleTimes()[order.castingName] || 60;

    if (remainingQty <= 0) {
      // Order already completed, skip date change
      continue;
    }

    // Apply available castings
    const castings = castingMap[order.castingName] || [];
    let qtyToProduce = remainingQty;

    for (const casting of castings) {
      if (qtyToProduce <= 0) break;

      const availableQty = casting.quantityProduced || 0;
      if (availableQty <= 0) continue;

      const usedQty = Math.min(availableQty, qtyToProduce);
      qtyToProduce -= usedQty;
      quantityProduced += usedQty;

      // Record usage
      await CastingUtilized.create({
        castingName: casting.castingName,
        quantityUsed: usedQty,
        quantityProducedKG: casting.quantityProducedKG,
        shiftOfProduction: casting.shiftOfProduction,
        machineNumber: casting.machineNumber,
        furnaceTemperature: casting.furnaceTemperature,
        dyeTemperature: casting.dyeTemperature,
        quantityRejected: casting.quantityRejected,
        rejectionCause: casting.rejectionCause,
        timeToFix: casting.timeToFix,
        machineDefectCause: casting.machineDefectCause,
        imageUrl: casting.imageUrl,
        postedBy: casting.postedBy,
        poNumber: order.poNumber,
      });

      // Update or delete the casting
      const leftover = availableQty - usedQty;
      if (leftover <= 0) {
        await Diecasting.findByIdAndDelete(casting._id);
        // Remove it from the local array too
        castingMap[order.castingName] = castingMap[order.castingName].filter(
          (c) => !c._id.equals(casting._id)
        );
      } else {
        casting.quantityProduced = leftover;
        await casting.save();
      }
    }

    const totalProduced = order.quantityProduced + quantityProduced;
    const isComplete = totalProduced >= originalQty;

    const qtyLeft = originalQty - totalProduced;
    totalSeconds += qtyLeft * cycleTime;
    const expectedDate = new Date(now.getTime() + totalSeconds * 1000);

    await Order.findByIdAndUpdate(order._id, {
      quantityProduced: totalProduced,
      isComplete,
      ...(isComplete ? {} : { dateOfCompletion: expectedDate }) // Only update date if not complete
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Order statuses and casting utilization refreshed"));
});


//  GET ALL ORDERS CONTROLLER
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    return res.status(204).json(
      new ApiResponse(204, {}, "No orders found")
    );
  }

  return res.status(200).json(
    new ApiResponse(200, orders, "All orders fetched successfully")
  );
});

export { createOrder, getAllOrders, refreshOrderStatus };
