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
  getTokenFromHeader,
  authentication,
  checkPermisson,
};
