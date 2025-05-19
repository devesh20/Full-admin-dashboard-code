import { MaterialSupplied } from '../models/materialSupplied.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// GET all Material Supplied entries
const getAllMaterialSupplied = asyncHandler(async (req, res) => {
  const materials = await MaterialSupplied.find().populate({
    path: 'postedBy',
    select: 'userName',
  });

  if (!materials || materials.length === 0) {
    return res
      .status(204)
      .json(new ApiResponse(204, {}, 'No material supplied found'));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, materials, 'Material supplied list'));
});

// DELETE a specific Material Supplied entry by ID
const deleteMaterialSupplied = asyncHandler(async (req, res) => {
  const materialId = req.params.id;

  const deletedMaterial = await MaterialSupplied.findByIdAndDelete(materialId);

  if (!deletedMaterial) {
    throw new ApiError(404, 'MaterialSupplied entry not found');
  }

  return res.status(200).json(
    new ApiResponse(200, deletedMaterial, 'MaterialSupplied entry deleted successfully')
  );
});

export {
  getAllMaterialSupplied,
  deleteMaterialSupplied,
};
