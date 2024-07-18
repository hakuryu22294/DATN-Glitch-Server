const multer = require("multer");

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});
const uploadMemory = multer({ storage: multer.memoryStorage() });

module.exports = { uploadDisk, uploadMemory };
