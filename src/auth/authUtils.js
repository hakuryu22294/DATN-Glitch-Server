const JWT = require("jsonwebtoken");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const { asyncHandler } = require("../helpers/asyncHandler");
const { Blacklist } = require("../models/blacklist.schema");
require("dotenv").config();

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
          throw new UnauthorizedError("Invalid Token 1");
        }
        return decode;
      }
    );
    req.user = decode;
    console.log(decode);
    if (!decode) {
      throw new UnauthorizedError("Invalid Token 2");
    }
    next();
  } catch (err) {
    throw err;
  }
});

module.exports = { createTokenPair, authentication, getTokenFromHeader };
