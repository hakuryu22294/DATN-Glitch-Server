const { Customer } = require("../models/customer.schema");
const bcrypt = require("bcryptjs");
const { Seller } = require("../models/seller.schema");
const { createTokenPair } = require("../auth/authUtils");
const { SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
const JWT = require("jsonwebtoken");
require("dotenv").config();
class CustomerController {
  register_ctm = async (req, res) => {
    const { name, email, password } = req.body;
    const customerExist = await Customer.findOne({ email });
    if (customerExist) throw new BadRequestError("Customer already exists");
    const hashPassword = await bcrypt.hash(password, 10);
    if (!hashPassword) throw new BadRequestError("Password is not valid");
    const createCustomer = await Customer.create({
      name: name.trim(),
      email: email.trim(),
      password: hashPassword,
      method: "menualy",
    });
    if (!createCustomer) throw new BadRequestError("Customer don't created");
    const token = await createTokenPair({
      id: createCustomer._id,
      email: createCustomer.email,
      name: createCustomer.name,
      role: createCustomer.role,
      method: createCustomer.method,
    });
    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    new SuccessResponse({
      message: "Customer created successfully",
      data: token,
    }).send(res);
  };
  reset_token = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) throw new BadRequestError("Please Login First !");
    const decode = await JWT.verify(token, process.env.JWT_SECRET);
    const user = await Customer.findById(decode.id);
    const newToken = await createTokenPair({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    res.cookie("accessToken", newToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    new SuccessResponse({
      message: "Reset token successfully",
      data: newToken,
    }).send(res);
  };
  get_seller_by_userId = async (req, res) => {
    const { id } = req.user;
    const seller = await Seller.findOne({ userId: id });
    new SuccessResponse({
      message: "Get seller by user id successfully",
      data: seller,
    }).send(res);
  };
  login_ctm = async (req, res) => {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email }).select("+password");
    if (!customer) throw new BadRequestError("Customer don't exists");
    const match = await bcrypt.compare(password, customer.password);
    if (!match) throw new BadRequestError("Password is not valid");
    const token = await createTokenPair({
      id: customer._id,
      email: customer.email,
      name: customer.name,
      role: customer.role,
      method: customer.method,
    });
    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    new SuccessResponse({
      message: "Customer login successfully",
      data: token,
    }).send(res);
  };
  logout_ctm = async (req, res) => {
    res.cookie("accessToken", null, {
      expires: new Date(Date.now() + 1000),
    });
    new SuccessResponse({
      message: "Customer logout successfully",
    }).send(res);
  };
}

module.exports = new CustomerController();
