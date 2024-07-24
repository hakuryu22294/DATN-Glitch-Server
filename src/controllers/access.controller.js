const { createTokenPair } = require("../auth/authUtils");
const { Admin } = require("../models/admin.schema");
const bcrypt = require("bcryptjs");
const { Seller } = require("../models/seller.schema");
const formidable = require("formidable");
const { cloudinary } = require("../configs/cloudinary.config");
const { SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
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
  seller_login = async (req, res) => {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email }).select("+password");
    if (!seller) throw new BadRequestError("Seller don't exists");
    const match = await bcrypt.compare(password, seller.password);
    if (!match) throw new BadRequestError("Password is not valid");
    const token = await createTokenPair({
      id: seller._id,
      role: seller.role,
    });
    if (!token) throw new BadRequestError("Creat token failed");
    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    new SuccessResponse({
      message: "Seller login successfully",
      data: token,
    }).send(res);
  };
  seller_register = async (req, res) => {
    const { name, email, password } = req.body;
    const sellerExist = await Seller.findOne({ email });
    if (sellerExist) throw new BadRequestError("Seller already exists");
    const hashPassword = await bcrypt.hash(password, 10);
    if (!hashPassword) throw new BadRequestError("Password is not valid");
    const createSeller = await Seller.create({
      name: name.trim(),
      email: email.trim(),
      password: hashPassword,
      method: "menualy",
    });
    if (!createSeller) throw new BadRequestError("Seller don't created");
    const token = await createTokenPair({
      id: createSeller._id,
      role: createSeller.role,
    });
    if (!token) throw new BadRequestError("Creat token failed");
    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    new SuccessResponse({
      message: "Seller created successfully",
      data: token,
    });
  };
  get_user = async (req, res) => {
    const { id, role } = req.user;
    console.log(req.user);
    console.log(id, role);
    let userGet = {};
    if (role === "admin") {
      userGet = await Admin.findById({ _id: id });
    } else if (role === "seller") {
      userGet = await Seller.findById({ _id: id });
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
}

module.exports = new AccessController();
