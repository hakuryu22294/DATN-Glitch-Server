const crypto = require("crypto");
const { Otp } = require("../models/otp.schema");

const generateTokenRandom = () => {
  const token = crypto.randomInt(0, Math.pow(2, 32));

  return token;
};

const newOtp = async () => {
  const token = generateTokenRandom();
  const newToken = await Otp.create({ otpToken: token, otpEmail: "email" });
  return newToken;
};

module.exports = { newOtp };
