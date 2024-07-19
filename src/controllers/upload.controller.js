const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromLocalS3 } = require("../services/upload.service");
const { BadRequestError } = require("../core/error.response");
class UploadController {
  uploadImageFromLocalS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) throw new BadRequestError("File missing");
    new SuccessResponse({
      message: "Upload file success",
      metadata: await uploadImageFromLocalS3({
        file,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
