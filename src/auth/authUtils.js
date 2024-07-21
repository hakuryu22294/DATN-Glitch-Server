const JWT = require("jsonwebtoken");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const { asyncHandler } = require("../helpers/asyncHandler");
const { Blacklist } = require("../models/blacklist.schema");
require("dotenv").config();
const HEADER = {
  API_KEY: "x-api-key",
};
const createTokenPair = async (payload) => {
  const accessToken = JWT.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  return accessToken;
};

const getTokenFromHeader = (req) => {
  if (
    req?.headers?.authorization &&
    req?.headers?.authorization.startsWith("Bearer")
  ) {
    return req.headers?.authorization.split(" ")[1];
  }
};
const authentication = asyncHandler(async (req, res, next) => {
  const accessToken = getTokenFromHeader(req);
  console.log(accessToken);
  if (!accessToken) {
    throw new UnauthorizedError("Invalid Request");
  }
  const blackList = await Blacklist.findOne({ key: accessToken });
  if (blackList) {
    throw new UnauthorizedError("Hack account cua thang khac a` ?????? stfu");
  }
  try {
    const decode = JWT.verify(
      accessToken,
      process.env.SECRET_KEY,
      (err, decode) => {
        if (err) {
          throw new UnauthorizedError("Invalid Token");
        }
        return decode;
      }
    );
    if (!decode) {
      throw new UnauthorizedError("Invalid Token");
    }
    next();
  } catch (err) {
    throw err;
  }
});

module.exports = { createTokenPair, authentication, getTokenFromHeader };
