const { Customer } = require("../models/customer.schema");
const bcrypt = require("bcryptjs");
const { Seller } = require("../models/seller.schema");
const { createTokenPair } = require("../auth/authUtils");
const { method } = require("lodash");
const { SuccessResponse } = require("../core/success.response");

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
    const myShop = await Seller.create({
      _id: createCustomer._id,
    });
    if (!myShop) throw new BadRequestError("Shop don't created");
    const token = await createTokenPair({
      id: createCustomer._id,
      email: createCustomer.email,
      name: createCustomer.name,
      method: createCustomer.method,
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    new SuccessResponse({
      message: "Customer created successfully",
      data: token,
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
      method: customer.method,
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    new SuccessResponse({
      message: "Customer login successfully",
      data: token,
    }).send(res);
  };
  logout_ctm = async (req, res) => {
    res.cookie("access_token", null, {
      expires: new Date(Date.now() + 1000),
    });
  };
}

module.exports = new CustomerController();
