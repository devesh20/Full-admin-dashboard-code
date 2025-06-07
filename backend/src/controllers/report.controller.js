import { asyncHandler } from "../utils/asyncHandler.js";
import { Diecasting } from "../models/diecasting.model.js";
import { CastingUtilized } from "../models/castingUtilized.model.js";
import { RotorUtilized } from "../models/rotorUtilized.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { MaterialRecieved } from "../models/materialRecieved.model.js";
import { RotorOrder } from "../models/rotorOrder.model.js";

const generateCastingReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, castingName, rejectionCause } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json(new ApiResponse(400, null, "Start and End date are required"));
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  if (start > end) {
    return res.status(400).json(new ApiResponse(400, null, "Start date cannot be after end date"));
  }

  const match = {
    createdAt: { $gte: start, $lte: end },
  };
  if (castingName) match.castingName = castingName;
  if (rejectionCause) match.rejectionCause = rejectionCause;

  const diecastingData = await Diecasting.aggregate([
    { $match: match },
    {
      $group: {
        _id: { castingName: "$castingName", rejectionCause: "$rejectionCause" },
        totalQuantityProduced: { $sum: { $toDouble: "$quantityProduced" } },
        totalQuantityRejected: { $sum: { $toDouble: "$quantityRejected" } },
      }
    },
  ]);

  // console.log("dates: ", req.body )
  console.log("dicasting: " , diecastingData)

  const castingUtilizedData = await CastingUtilized.aggregate([
    { $match: match },
    {
      $group: {
        _id: { castingName: "$castingName", rejectionCause: "$rejectionCause" },
        totalQuantityProduced: { $sum: { $toDouble: "$quantityUsed" } },
        totalQuantityRejected: { $sum: { $toDouble: "$quantityRejected" } },
      }
    }
  ]);

  const combined = [...diecastingData, ...castingUtilizedData];

  const grouped = [];

  combined.forEach(item => {
    const { castingName, rejectionCause } = item._id;
    const existing = grouped.find(entry => entry.castingName === castingName && entry.rejectionCause === rejectionCause);

    if (existing) {
      existing.totalQuantityProduced += item.totalQuantityProduced;
      existing.totalQuantityRejected += item.totalQuantityRejected;
    } else {
      grouped.push({
        castingName,
        rejectionCause,
        totalQuantityProduced: item.totalQuantityProduced,
        totalQuantityRejected: item.totalQuantityRejected,
      });
    }
  });

  if (grouped.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No data found for the given filters"));
  }

  return res.status(200).json(new ApiResponse(200, grouped, "Report generated successfully"));
});


const getOrderProductionGraph = asyncHandler(async (req, res) => {
  const { poNumber } = req.params;
  console.log("Fetching full production + rejection data for PO:", poNumber);

  if (!poNumber) {
    return res.status(400).json(new ApiResponse(400, null, "PO number is required"));
  }

  const poNum = Number(poNumber);           // 6062025 (drops any leading zeros)
  if (Number.isNaN(poNum)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid PO number"));
  }

  const order = await Order.findOne({ $or: [{poNumber}, {poNumber: poNum}] }).lean(); // .lean() returns plain JS object
  if (!order) {
    return res.status(404).json(new ApiResponse(404, null, "Order not found"));
  }

   const matchStage = { $match: { poNumber: poNum } };
  //  Production Graph: grouped by date
  const productionGraph = await CastingUtilized.aggregate([
    matchStage,
    // {
    //   $match: {
    //     $expr: {
    //       $eq: [
    //         { $toString: "$poNumber" },
    //         poNumber.toString()
    //       ]
    //     }
    //   }
    // },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          }
        },
        totalQuantity: { $sum: "$quantityUsed" }
      }
    },
    { $sort: { "_id.date": 1 } },
    {
      $project: {
        date: "$_id.date",
        totalQuantity: 1,
        _id: 0
      }
    }
  ]);
  

  //  Rejection Graph: grouped by cause
  const rejectionGraph = await CastingUtilized.aggregate([
  matchStage,
  { $match: { quantityRejected: { $gt: 0 } } },
  {
    $group: {
      _id: "$rejectionCause",
      count: { $sum: "$quantityRejected"}
    }
  },
  {
    $project: {
      reason: "$_id",
      count: 1,
      _id: 0
    }
  }
]);

  // Merge productionGraph and rejectionGraph into the order object
  const data = {
    ...order,
    productionGraph,
    rejectionGraph
  };

  console.log("Fetched production and rejection data:", data);
  return res.status(200).json(
    new ApiResponse(200, data, "Order with production and rejection data fetched")
  );
});


// const getMaterialReceivedReport = asyncHandler(async (req, res) => {
//   const { startDate, endDate, supplierName, materialGrade } = req.body;

//   if (!startDate || !endDate || !supplierName || !materialGrade) {
//     return res.status(400).json(
//       new ApiResponse(400, null, "Start date, end date, supplier name, and material grade are required")
//     );
//   }

//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   end.setHours(23, 59, 59, 999); // Include entire end date

//   if (start > end) {
//     return res.status(400).json(new ApiResponse(400, null, "Start date cannot be after end date"));
//   }

//   const matchStage = {
//     createdAt: { $gte: start, $lte: end },
//     supplierName: supplierName,
//     materialGrade: materialGrade
//   };

//   const result = await MaterialRecieved.aggregate([
//     { $match: matchStage },
//     {
//       $group: {
//         _id: {
//           supplierName: "$supplierName",
//           materialGrade: "$materialGrade"
//         },
//         totalQuantity: { $sum: "$materialQuantity" },
//         totalQuantityKG: { $sum: "$materialQuantityKG" },
//         totalWeightDiscrepancy: { $sum: { $ifNull: ["$weightDiscrepancy", 0] } }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         supplierName: "$_id.supplierName",
//         materialGrade: "$_id.materialGrade",
//         totalQuantity: 1,
//         totalQuantityKG: 1,
//         totalWeightDiscrepancy: 1
//       }
//     }
//   ]);

//   // Check if data is returned and send the result array
//   if (result.length === 0) {
//     return res.status(404).json(new ApiResponse(404, null, "No data found for the given filters"));
//   }

//   return res.status(200).json(
//     new ApiResponse(200, result, "Material received report generated successfully")
//   );
// });

const getMaterialReceivedReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, supplierName, materialGrade } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json(new ApiResponse(400, null, "Start and End date are required"));
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Include entire end date

  if (start > end) {
    return res.status(400).json(new ApiResponse(400, null, "Start date cannot be after end date"));
  }

  const match = {
    createdAt: { $gte: start, $lte: end },
  };
  if (supplierName) match.supplierName = supplierName;
  if (materialGrade) match.materialGrade = materialGrade;

  const materialData = await MaterialRecieved.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          supplierName: "$supplierName",
          materialGrade: "$materialGrade"
        },
        totalQuantity: { $sum: { $toDouble: "$materialQuantity" } },
        totalQuantityKG: { $sum: { $toDouble: "$materialQuantityKG" } },
        totalWeightDiscrepancy: { $sum: { $toDouble: { $ifNull: ["$weightDiscrepancy", 0] } } }
      }
    }
  ]);

  const combined = [...materialData];

  const grouped = [];

  combined.forEach(item => {
    const { supplierName, materialGrade } = item._id;
    const existing = grouped.find(entry => entry.supplierName === supplierName && entry.materialGrade === materialGrade);

    if (existing) {
      existing.totalQuantity += item.totalQuantity;
      existing.totalQuantityKG += item.totalQuantityKG;
      existing.totalWeightDiscrepancy += item.totalWeightDiscrepancy;
    } else {
      grouped.push({
        supplierName,
        materialGrade,
        totalQuantity: item.totalQuantity,
        totalQuantityKG: item.totalQuantityKG,
        totalWeightDiscrepancy: item.totalWeightDiscrepancy,
      });
    }
  });

  if (grouped.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No data found for the given filters"));
  }

  return res.status(200).json(new ApiResponse(200, grouped, "Material received report generated successfully"));
});


const getRotorOrderProductionGraph = asyncHandler(async (req, res) => {
  const { annexureNumber } = req.params;
  console.log("Fetching production + rejection data for Rotor Order:", annexureNumber);

  if (!annexureNumber) {
    return res.status(400).json(new ApiResponse(400, null, "Annexure number is required"));
  }

  const rotorOrder = await RotorOrder.findOne({ annexureNumber }).lean();
  if (!rotorOrder) {
    return res.status(404).json(new ApiResponse(404, null, "Rotor order not found"));
  }

  // Production Graph: grouped by date
  const productionGraph = await RotorUtilized.aggregate([
    {
      $match: {
        $expr: {
          $eq: [
            { $toString: "$annexureNumber" },
            annexureNumber.toString()
          ]
        }
      }
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          }
        },
        totalQuantity: { $sum: "$quantityUsed" }
      }
    },
    { $sort: { "_id.date": 1 } },
    {
      $project: {
        date: "$_id.date",
        totalQuantity: 1,
        _id: 0
      }
    }
  ]);

  // Rejection Graph: grouped by cause
  const rejectionGraph = await CastingUtilized.aggregate([
    {
      $match: {
        $expr: {
          $eq: [
            { $toString: "$annexureNumber" },
            annexureNumber.toString()
          ]
        }
      }
    },
    {
      $group: {
        _id: "$rejectionCause",
        count: { $sum: { $ifNull: ["$quantityRejected", 0] } }
      }
    },
    {
      $project: {
        reason: "$_id",
        count: 1,
        _id: 0
      }
    }
  ]);

  const data = {
    ...rotorOrder,
    productionGraph,
    rejectionGraph
  };

  console.log("Fetched rotor production and rejection data:", data);
  return res.status(200).json(
    new ApiResponse(200, data, "Rotor order with production and rejection data fetched")
  );
});




export { generateCastingReport, getOrderProductionGraph, getMaterialReceivedReport, getRotorOrderProductionGraph};
