const { createTokenPair } = require("../auth/authUtils");
const { Admin } = require("../models/admin.schema");
const bcrypt = require("bcryptjs");
const { Seller } = require("../models/seller.schema");
const formidable = require("formidable");
const { cloudinary } = require("../configs/cloudinary.config");
const { SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
const { Customer } = require("../models/customer.schema");
const { Otp } = require("../models/otp.schema");
class AccessController {
  admin_login = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    console.log(admin);
    if (!admin) throw new BadRequestError("Admin don't exists");
    const match = await bcrypt.compare(password, admin.password);
    console.log(match);
    if (!match) throw new BadRequestError("Password is not valid");
    const token = await createTokenPair({
      id: admin._id,
      role: admin.role,
    });
    if (!token) throw new BadRequestError("Creat token failed");
    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    new SuccessResponse({
      message: "Admin login successfully",
      data: token,
    }).send(res);
  };
  seller_register = async (req, res) => {
    const { shopInfo, userId } = req.body;
    const sellerExist = await Seller.findOne({ userId });

    if (sellerExist) throw new BadRequestError("Seller already exists");
    const createSeller = await Seller.create({
      userId,
      shopInfo,
    });
    if (!createSeller) throw new BadRequestError("Seller don't created");
    await Customer.findByIdAndUpdate(
      { _id: userId },
      { role: "seller" },
      { new: true }
    );
    new SuccessResponse({
      message: "Seller created successfully",
      data: createSeller,
    }).send(res);
  };
  get_user = async (req, res) => {
    const { id, role } = req.user;
    console.log(id, role);
    let userGet = {};
    if (role === "admin") {
      userGet = await Admin.findById({ _id: id });
    } else if (role === "seller") {
      userGet = await Seller.findOne({ userId: id });
      console.log(userGet);
    } else {
      userGet = await Customer.findById({ _id: id });
    }
    new SuccessResponse({
      message: "Get user successfully",
      data: userGet,
    }).send(res);
  };
  profile_image_upload = async (req, res) => {
    console.log(req.user);
    const { id } = req.user;

    const form = formidable({ multiples: true });
    form.parse(req, async (err, _, files) => {
      const { image } = files;
      const result = await cloudinary.uploader.upload(image.filepath, {
        folder: "profile",
        format: "jpg",
        width: 300,
        height: 300,
      });
      if (!result) throw new BadRequestError("Upload image failed");
      const user = await Seller.findByIdAndUpdate(
        { _id: id },
        { image: result.url },
        { new: true }
      );
      const userInfo = await Seller.findById({ _id: id });
      if (!userInfo) throw new BadRequestError("User don't found");
      new SuccessResponse({
        message: "Upload image successfully",
        data: userInfo,
      }).send(res);
    });
  };
  profile_info_add = async (req, res) => {
    const { division, district, shopName, subDistrict } = req.body;
    const { id } = req.user;
    await Seller.findByIdAndUpdate(
      { _id: id },
      {
        shopInfo: {
          shopName,
          division,
          district,
          subDistrict,
        },
      }
    );
    const userInfo = await Seller.findById({ _id: id });
    if (!userInfo) throw new BadRequestError("User don't found");
    new SuccessResponse({
      message: "Add profile info successfully",
      data: userInfo,
    }).send(res);
  };
  logout = async (req, res) => {
    res.cookie("accessToken", null, {
      expires: new Date(Date.now() + 1000),
      httpOnly: true,
    });
    new SuccessResponse({ message: "Logout successfully" }).send(res);
  };

  verify_otp = async (req, res) => {
    const { token } = req.params;
    const otp = await Otp.findOne({ otp: token });
    if (!otp) throw new BadRequestError("Otp don't exists");
    await Otp.findByIdAndDelete(otp._id);
    new SuccessResponse({
      message: "Verify otp successfully",
    }).send(res);
  };
}

module.exports = new AccessController();
