const { VNPay, ProductCode, Bank } = require("vnpay");
const Transaction = require("../models/payment.schema");
const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const moment = require("moment");
require("dotenv").config();

const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN,
  secureSecret: process.env.VNPAY_SECRET,
  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true,
  hashAlgorithm: "SHA512",
});
class PaymentController {
  createPayment = async (req, res) => {
    const { amount, orderId, returnUrl } = req.body;
    console.log(amount, orderId, returnUrl);
    if (!amount || !orderId || !returnUrl) {
      throw new BadRequestError("Invalid input 1");
    }
    const bankList = await vnpay.getBankList();

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr:
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: "Thanh toan don hang" + orderId,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: returnUrl,
      vnp_Locale: "vn",
    });
    if (!paymentUrl) throw new BadRequestError("Invalid input 2");

    new SuccessResponse({
      message: "Create payment successfully",
      data: paymentUrl,
    }).send(res);
  };

  saveTransaction = async (req, res) => {
    const { orderId, amount, responseCode, paymentStatus } = req.body;

    if (!orderId || !amount || !responseCode || !paymentStatus) {
      throw new BadRequestError("Invalid input");
    }

    const transaction = new Transaction({
      orderId,
      amount,
      responseCode,
      paymentStatus,
    });
    await transaction.save();
    new SuccessResponse({
      message: "Save transaction successfully",
      data: transaction,
    }).send(res);
  };

  
}

module.exports = new PaymentController();
