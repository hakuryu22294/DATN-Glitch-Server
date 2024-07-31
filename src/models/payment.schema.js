const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "VND" },
  responseCode: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
