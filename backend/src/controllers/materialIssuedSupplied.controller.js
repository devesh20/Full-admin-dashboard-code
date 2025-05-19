import { MaterialIssuedSupplied } from '../models/materialIssuedSupplied.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const getAllMaterialIssuedSupplied = asyncHandler(async (req, res) => {
  const materialIssuedSupplied = await MaterialIssuedSupplied.find().populate({
    path: 'postedBy',
    select: 'userName', // only include userName from User
  });

  if (!materialIssuedSupplied || materialIssuedSupplied.length === 0) {
    return res
      .status(204)
      .json(new ApiResponse(204, {}, 'No material issued supplied'));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, materialIssuedSupplied, 'Material issued supplied list')
    );
});

const deleteMaterialIssuedSupplied = asyncHandler(async (req, res) => {
  const materialId = req.params.id;

  const deletedMaterial = await MaterialIssuedSupplied.findByIdAndDelete(materialId);

  if (!deletedMaterial) {
    throw new ApiError(404, 'MaterialIssuedSupplied entry not found');
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedMaterial,
      'MaterialIssuedSupplied entry deleted successfully'
    )
  );
});

export {
  getAllMaterialIssuedSupplied,
  deleteMaterialIssuedSupplied
};
