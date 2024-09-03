const { createTokenPair } = require("../auth/authUtils");
const transporter = require("../configs/mail.configs");
const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { Order } = require("../models/order.schema");
const { Otp } = require("../models/otp.schema");
const { Shipper } = require("../models/shipper.schema");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const { ShipperWallet } = require("../models/shipperWallet");
const { ShopWallet } = require("../models/shopWallet.schema");
class ShipperController {
  create_shipper = async (req, res) => {
    const { name, email, phone, password, address } = req.body;
    const shipperExist = await Shipper.findOne({ $or: [{ email }, { phone }] });
    if (shipperExist) throw new BadRequestError("Shipper already exists");
    const hashPassword = await bcryptjs.hash(password, 10);
    if (!hashPassword) throw new BadRequestError("Hash password failed");
    const newShipper = await Shipper.create({
      name,
      email,
      phone,
      password: hashPassword,
      address,
    });
    if (!newShipper) throw new BadRequestError("Shipper don't created");

    const otp = crypto.randomBytes(32).toString("hex");
    const verifyDomain = `http://localhost:5173/verify-otp/shipper/${otp}`;
    await Otp.create({
      email,
      otp,
    });
    if (!otp) throw new BadRequestError("Otp don't created");
    const mailOption = {
      from: {
        name: "Glitch Express",
        address: "quanghack12b@gmail.com",
      },
      to: email,
      subject: "Welcome to Glitch Express",
      html: `<p>Click here to verify your account: <a href="${verifyDomain}">Verify</a></p>`,
    };
    await transporter.sendMail(mailOption);

    new SuccessResponse({
      message: "Shipper created successfully",
    }).send(res);
  };

  verify_otp = async (req, res) => {
    const { token } = req.params;
    const otp = await Otp.findOne({ otp: token });
    if (!otp) throw new BadRequestError("Otp don't exists");
    await Otp.findByIdAndDelete(otp._id);
    await Shipper.findOneAndUpdate(
      { email: otp.email },
      { verify: true },
      {
        new: true,
      }
    );
    new SuccessResponse({
      message: "Verify otp successfully",
    }).send(res);
  };

  login_shipper = async (req, res) => {
    const { email, password } = req.body;
    const shipper = await Shipper.findOne({ email });
    if (!shipper) throw new BadRequestError("Shipper don't exists");
    const match = await bcryptjs.compare(password, shipper.password);
    if (!match) throw new BadRequestError("Password is not valid");
    const token = await createTokenPair({
      id: shipper._id,
      email: shipper.email,
      name: shipper.name,
      role: shipper.role,
    });
    if (!token) throw new BadRequestError("Creat token failed");
    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    new SuccessResponse({
      message: "Shipper login successfully",
      data: token,
    }).send(res);
  };

  get_all_shippers = async (req, res) => {
    const shippers = await Shipper.find();
    if (!shippers) throw new BadRequestError("Shippers don't exists");
    new SuccessResponse({
      message: "Get all shippers successfully",
      data: shippers,
    }).send(res);
  };

  get_all_orders = async (req, res) => {
    const { shipperId } = req.params;
    const orders = await Order.find({ shipperId, deliveryStatus: "assigned" })
      .populate("customerId")
      .populate("sellerId");
    if (!orders) throw new BadRequestError("Orders don't exists");
    new SuccessResponse({
      message: "Get all orders successfully",
      data: orders,
    }).send(res);
  };
  update_delivery_status = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const validStatus = ["not_assigned", "assigned", "delivered", "cancelled"];
    if (!validStatus.includes(status))
      throw new BadRequestError("Invalid status");
    const order = await Order.findByIdAndUpdate(
      { _id: orderId },
      { deliveryStatus: status },
      { new: true }
    );
    if (!order) throw new BadRequestError("Order don't exists");
    const { totalPrice, sellerId } = order;
    if (status === "delivered") {
      await ShopWallet.create({
        sellerId: sellerId,
        amount: totalPrice,
        month: moment().format("M"),
        year: moment().format("YYYY"),
        day: moment().format("D"),
      });
    }
    new SuccessResponse({
      message: "Update delivery status successfully",
      data: order,
    }).send(res);
  };
  get_shipper_info = async (req, res) => {
    const { id } = req.user;
    const shipper = await Shipper.findById({ _id: id });
    if (!shipper) throw new BadRequestError("Shipper don't exists");
    new SuccessResponse({
      message: "Get shipper info successfully",
      data: shipper,
    }).send(res);
  };
  get_shipper_dashboard = async (req, res) => {
    const { shipperId } = req.params;
    const totalIncome = await ShipperWallet.aggregate([
      {
        $match: { shipperId: shipperId },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    const orderCounts = await Order.aggregate([
      {
        $match: { shipperId: shipperId },
      },
      {
        $group: {
          _id: null,
          success: {
            $sum: {
              $cond: [{ $eq: ["$deliveryStatus", "delivered"] }, 1, 0],
            },
          },
          failed: {
            $sum: {
              $cond: [{ $eq: ["$deliveryStatus", "cancelled"] }, 1, 0],
            },
          },
          recived: {
            $sum: {
              $cond: [{ $eq: ["$deliveryStatus", "shipped"] }, 1, 0],
            },
          },
        },
      },
    ]);
    const orderPrice = 5000;
    new SuccessResponse({
      message: "Get shipper dashboard successfully",
      data: {
        totalIncome: totalIncome.length ? totalIncome[0].totalAmount : 0,
        successOrders: orderCounts.length ? orderCounts[0].success : 0,
        failedOrders: orderCounts.length ? orderCounts[0].failed : 0,
        recivedOrders: orderCounts.length ? orderCounts[0].recived : 0,
        expectIncome:
          (orderCounts.length ? orderCounts[0].success : 0) * orderPrice,
      },
    }).send(res);
  };
}

module.exports = new ShipperController();
