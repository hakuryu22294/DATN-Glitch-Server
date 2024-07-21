const crypto = require("crypto");
const { Otp } = require("../models/otp.schema");
const { NotFoundError } = require("../core/error.response");

const generateTokenRandom = () => {
  const token = crypto.randomInt(0, Math.pow(2, 32));

  return token;
};

const newOtp = async ({ email }) => {
  const token = generateTokenRandom();
  const newToken = await Otp.create({ otpToken: token, otpEmail: email });
  console.log(newToken);
  return newToken;
};

const checkEmailToken = async ({ token }) => {
  const tokenOTP = await Otp.findOne({ otpToken: token }).lean();
  if (!tokenOTP) throw new NotFoundError("Token not found or expired");
  Otp.deleteOne({ otpToken: tokenOTP.otpToken }).then();
  return tokenOTP;
};

module.exports = { newOtp, checkEmailToken };
