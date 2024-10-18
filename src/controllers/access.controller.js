const { createTokenPair } = require("../auth/authUtils");
const { Admin } = require("../models/admin.schema");
const bcrypt = require("bcryptjs");
const { Seller } = require("../models/seller.schema");
const formidable = require("formidable");
const { cloudinary } = require("../configs/cloudinary.config");
const { SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
const { Customer } = require("../models/customer.schema");
const { Shipper } = require("../models/shipper.schema");
const { Otp } = require("../models/otp.schema");
const sendEmail = require("../utils/sendEmail");
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
    const updateRole = await Customer.findByIdAndUpdate(
      { _id: userId },
      { role: "seller" },
      { new: true }
    ).populate({ path: "userId", select: "email" });
    if (updateRole) {
      await sendEmail(
        "admin@gmail.com",
        "Cửa hàng đăng ký mới",
        `Bạn nhận được một yêu cầu active cửa hàng từ ${updateRole.email}, vui lòng vào trang quản trị để active cửa hàng`
      );
    }
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
    } else if (role === "seller" || role === "user") {
      userGet = await Customer.findById({ _id: id });
    } else if (role === "shipper") {
      userGet = await Shipper.findById({ _id: id });
    }
    new SuccessResponse({
      message: "Get user successfully",
      data: userGet,
    }).send(res);
  };
  profile_image_upload = async (req, res) => {
    const { sellerId } = req.params;

    const form = formidable({ multiples: true });
    form.parse(req, async (err, _, files) => {
      const { image } = files;
      const result = await cloudinary.uploader.upload(image.filepath, {
        folder: "profile",
        width: 300,
        height: 300,
      });
      if (!result) throw new BadRequestError("Upload image failed");
      const sellerUpdate = await Seller.findByIdAndUpdate(
        { _id: sellerId },
        { avatar: result.url },
        { new: true }
      );

      new SuccessResponse({
        message: "Upload image successfully",
        data: sellerUpdate,
      }).send(res);
    });
  };
  profile_info_add = async (req, res) => {
    const { phoneNumber, address, sellerId } = req.body;
    console.log(address);
    const updatedSeller = await Seller.findByIdAndUpdate(
      { _id: sellerId },
      {
        $set: {
          "shopInfo.phoneNumber": phoneNumber,
          "shopInfo.address": address,
        },
      },
      { new: true }
    );

    if (!updatedSeller) {
      throw new BadRequestError("Không tìm thấy người dùng");
    }

    new SuccessResponse({
      message: "Cập nhật thông tin profile thành công",
      data: updatedSeller,
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
