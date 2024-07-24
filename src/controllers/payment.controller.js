require("dotenv").config();
const { Types } = require("mongoose");
const { Seller } = require("../models/seller.schema");
const { ShopWallet } = require("../models/shopWallet.schema");
const { Stripe } = require("../models/stripe.schema");
const { Withdraw } = require("../models/withdraw.schemaReq");
const { v4: uuidv4 } = require("uuid");
const { SuccessResponse } = require("../core/success.response");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class PaymentController {
  create_stripe_connect_acc = async (req, res) => {
    const { id } = req;
    const uid = uuidv4();
    const stripeInfo = await Stripe.findOne({ sellerId: id });
    if (stripeInfo) {
      await Stripe.deleteOne({ sellerId: id });
      const account = await stripe.accounts.create({ type: "express" });
      const accontLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: "http://localhost:5173/refresh",
        return_url: `http://localhost:5173/success?activeCode=${uid}`,
        type: "account_onboarding",
      });
      await Stripe.create({
        sellerId: id,
        stripeId: account.id,
        code: uid,
      });
      new SuccessResponse({
        message: "Stripe account created successfully",
        data: {
          url: accontLink.url,
        },
      }).send(res);
    } else {
      const account = await stripe.accounts.create({ type: "express" });
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: "http://localhost:5173/refresh",
        return_url: `http://localhost:5173/success?activeCode=${uid}`,
        type: "account_onboarding",
      });
      new SuccessResponse({
        message: "Stripe account created successfully",
        data: {
          url: accountLink.url,
        },
      }).send(res);
    }
  };
  active_stripe_connect_acc = async (req, res) => {
    const { activeCode } = req.params;
    const { id } = req;
    const userStripeInfo = await Stripe.findOne({ code: activeCode });
    if (!userStripeInfo) {
      throw new Error("Active payment failed");
    }
    await Seller.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        payment: "active",
      }
    );
    new SuccessResponse({
      message: "Active stripe account successfully",
    }).send(res);
  };
  sumAmount = (data) => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i].amount;
    }
    return sum;
  };
  get_seller_payment_details = async (req, res) => {
    const { sellerId } = req.params;
    const payment = await Seller.find({ sellerId });
    const pendingWithdraw = await Withdraw.find({
      $and: [
        {
          sellerId: {
            $eq: new Types.ObjectId(sellerId),
          },
        },
        {
          status: {
            $eq: "pending",
          },
        },
      ],
    });
    const successWithdraw = await Withdraw.find({
      $and: [
        {
          sellerId: {
            $eq: new Types.ObjectId(sellerId),
          },
        },
        {
          status: {
            $eq: "success",
          },
        },
      ],
    });
    const pendingAmount = this.sumAmount(pendingWithdraw);
    const withdrawAmount = this.sumAmount(successWithdraw);
    const totalAmount = this.sumAmount(payment);
    let availabelAmount = 0;
    if (totalAmount > 0) {
      availabelAmount = totalAmount - (pendingAmount + withdrawAmount);
    }
    new SuccessResponse({
      message: "Get seller payment details successfully",
      data: {
        totalAmount,
        availabelAmount,
        pendingAmount,
        withdrawAmount,
        pendingWithdraw,
        successWithdraw,
      },
    });
  };
  withdraw_request = async (req, res) => {
    const { amount, sellerId } = req.body;
    const withdraw = await Withdraw.create({
      sellerId,
      amount: parseInt(amount),
    });
    if (!withdraw) throw new Error("Withdraw request failed");
    new SuccessResponse({
      message: "Withdraw request successfully",
      data: withdraw,
    }).send(res);
  };
  get_payments_request = async (req, res) => {
    const withdrawRequest = await Withdraw.find({
      status: "pending",
    });
    new SuccessResponse({
      message: "Withdraw request successfully",
      data: withdrawRequest,
    }).send(res);
  };
  payment_request_confirm = async (req, res) => {
    const { paymentId } = req.body;
    const payment = await Withdraw.findById({ _id: paymentId });
    if (!payment) throw new Error("Payment request failed");
    const { stripeId } = await Stripe.findOne({
      sellerId: new Types.ObjectId(payment.sellerId),
    });
    await stripe.transfers.create({
      amount: payment.amount * 100,
      currency: "vnd",
      destination: stripeId,
    });
    await Withdraw.findByIdAndUpdate({ _id: paymentId }, { status: "success" });
    new SuccessResponse({
      message: "Payment request successfully",
      data: payment,
    }).send(res);
  };
}

module.exports = new PaymentController();
