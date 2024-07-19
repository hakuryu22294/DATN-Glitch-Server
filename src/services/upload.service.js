const { s3, PutObjectCommand } = require("../configs/s3.config");
require("dotenv").config();

const uploadImageFromUrl = async () => {
  try {
    const urlImage = "";
    const folderName = `/products/shopId`,
      newFileName = "image.jpg";
  } catch (err) {}
};
const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const randomImageName = () => crypto.randomBytes(64).toString("hex");
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname || "unknown",
      Body: file.buffer,
      ContentType: "image/jpeg",
    });
    const result = await s3.send(command);
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { uploadImageFromLocalS3 };
