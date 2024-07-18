const { Router } = require("express");
const UploadController = require("../../controllers/upload.controller");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");
const { asyncHandler } = require("../../helpers/asyncHandler");
const uploadRouter = Router();

uploadRouter.post(
  "/bucket",
  uploadMemory.single("file"),
  asyncHandler(UploadController.uploadImageFromLocalS3)
);

module.exports = uploadRouter;
