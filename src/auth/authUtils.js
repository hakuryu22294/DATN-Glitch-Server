const JWT = require("jsonwebtoken");
const { UnauthorizedError, ForbiddenError } = require("../core/error.response");
const { asyncHandler } = require("../helpers/asyncHandler");
require("dotenv").config();

const createTokenPair = async (payload) => {
  const accessToken = JWT.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  return accessToken;
};

const authentication = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    throw new UnauthorizedError("Please login first 1");
  }
  const payload = JWT.verify(accessToken, process.env.SECRET_KEY);
  req.user = payload;
  next();
});

const checkPermisson = (...role) => {
  return (req, res, next) => {
    if (role.includes(req.user.role)) {
      next();
    } else {
      throw new ForbiddenError("Permission denied");
    }
  };
};

module.exports = {
  createTokenPair,
  authentication,
  checkPermisson,
};
