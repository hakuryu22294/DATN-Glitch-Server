const JWT = require("jsonwebtoken");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const KeyService = require("../services/key.service");
const { asyncHandler } = require("../helpers/asyncHandler");
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //access token
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    //verify
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) throw err;
    });
    return { accessToken, refreshToken };
  } catch (err) {
    return err;
  }
};
const authentication = asyncHandler(async (req, res, next) => {
  // check userId missing ?
  // get access token
  //verify token
  // check user in dbs
  // check keyStore with this userId
  // Ok all => return next
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedError("Invalid Request");
  }

  const keyStore = await KeyService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Key Store not found");
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new UnauthorizedError("Invalid Request");
  }
  try {
    const decode = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decode.userId) {
      throw new UnauthorizedError("Invalid User");
    }
    req.keyStore = keyStore;
    return next();
  } catch (err) {
    throw err;
  }
});

const verifyJWT = async (token, keySceret) => {
  return JWT.verify(token, keySceret);
};

module.exports = { createTokenPair, authentication, verifyJWT };
