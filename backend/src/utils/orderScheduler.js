import cron from "node-cron";
import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { Diecasting } from "../models/diecasting.model.js";
import { CastingUtilized } from "../models/castingUtilized.model.js";
import { castingDetails } from "../constant.js"

// Run every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("🔄 Scheduler started at", new Date().toLocaleString());

  try {
    const pendingOrders = await Order.find({ isComplete: false });

    for (const order of pendingOrders) {
      const partNumber = order.partNumber;
      const castingName = castingDetails[partNumber];
      if (!castingName) {
        console.warn(`⚠️ No castingName found for part number ${partNumber}`);
        continue;
      }

      const castings = await Dyecasting.find({ castingName });
      let remainingQty = order.quantity - order.quantityProduced;

      for (const casting of castings) {
        if (remainingQty <= 0) break;

        const availableQty = Number(casting.quantityProduced) || 0;
        if (availableQty <= 0) continue;

        const qtyToUse = Math.min(remainingQty, availableQty);

        // Create utilized record
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
          poNumber: order.poNumber,
        });

        // Update order's progress
        order.quantityProduced += qtyToUse;
        remainingQty -= qtyToUse;

        // Mark as complete if fully fulfilled
        if (order.quantityProduced >= order.quantity) {
          order.isComplete = true;
        }

        await order.save();

        // Update or delete the casting
        const leftover = availableQty - qtyToUse;
        if (leftover <= 0) {
          await Dyecasting.findByIdAndDelete(casting._id);
        } else {
          await Dyecasting.findByIdAndUpdate(casting._id, {
            quantityProduced: leftover,
          });
        }
      }
    }

    console.log("✅ Scheduler completed at", new Date().toLocaleString());
  } catch (error) {
    console.error("❌ Error in scheduler:", error.message);
  }
});
