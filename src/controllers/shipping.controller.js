const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { Customer } = require("../models/customer.schema");

class ShippingController {
  add_shipping_info = async (req, res) => {
    const { customerId, shippingData } = req.body;

    const customer = await Customer.findById({ _id: customerId });
    if (!customer) {
      throw new BadRequestError("Customer not found");
    }

    if (customer.shippingInfo.length >= 2) {
      customer.shippingInfo.shift();
    }
    customer.shippingInfo.push(shippingData);
    await customer.save();

    new SuccessResponse({
      message: "Shipping address added successfully",
      data: customer.shippingInfo,
    }).send(res);
  };

  update_shipping_info = async (req, res) => {
    const { customerId, index } = req.params;
    const updatedData = req.body;

    const customer = await Customer.findById({ _id: customerId });
    if (!customer) {
      throw new BadRequestError("Customer not found");
    }

    if (index < 0 || index >= customer.shippingInfo.length) {
      throw new BadRequestError("Invalid index");
    }

    customer.shippingInfo[index] = updatedData;
    await customer.save();

    new SuccessResponse({
      message: "Shipping address updated successfully",
      data: customer.shippingInfo,
    }).send(res);
  };

  delete_shipping_info = async (req, res) => {
    const { customerId, index } = req.params;

    const customer = await Customer.findById({ _id: customerId });
    if (!customer) {
      throw new BadRequestError("Customer not found");
    }

    if (index < 0 || index >= customer.shippingInfo.length) {
      throw new BadRequestError("Invalid index");
    }

    customer.shippingInfo.splice(index, 1);
    await customer.save();

    new SuccessResponse({
      message: "Shipping address deleted successfully",
      data: customer.shippingInfo,
    }).send(res);
  };
}

module.exports = new ShippingController();
