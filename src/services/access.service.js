const shopSchema = require("../models/shop.schema");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const KeyService = require("./key.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData, convertToObjectId } = require("../utils");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const keySchema = require("../models/key.schema");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    //check email exist
    const hodelShop = await shopSchema.findOne({ email }).lean();
    if (hodelShop) {
      throw new BadRequestError("Shop already exist");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newShop = await shopSchema.create({
      name,
      email,
      password: hashPassword,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      const publicKey = crypto.randomBytes(64).toString("hex"); //save collection key store
      const privateKey = crypto.randomBytes(64).toString("hex"); //save collection key store
      const keyStore = await KeyService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new BadRequestError("Can not create key store");
      }
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );

      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }
    throw new BadRequestError("Can not create shop");
  };
  static signIn = async ({ email, password, refreshToken = null }) => {
    //check email in dbs
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered");
    //match password
    const matchPassword = bcrypt.compare(password, foundShop.password);
    if (!matchPassword) throw new UnauthorizedError("Wrong password");
    //create access token and refresh token and save
    const publicKey = crypto.randomBytes(64).toString("hex"); //save collection key store
    const privateKey = crypto.randomBytes(64).toString("hex"); //save collection key store
    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
        email,
      },
      publicKey,
      privateKey
    );
    const keyStore = await KeyService.createKeyToken({
      userId: foundShop._id,
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
    //generate tokens
    //get data return login
  };
  static logout = async (keyStore) => {
    const delKey = await KeyService.removeKeyById(keyStore._id);
    return delKey;
  };

  //check token used
  static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyService.removeKeyById(keyStore._id);
      throw new ForbiddenError("Something wrong happened !! Please re-login");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Shop not registered");
    }

    const foundShop = await findByEmail({ email });
    if (!foundShop)
      throw new UnauthorizedError("Shop not registered or invalid token");

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    await keySchema.updateOne(
      {
        _id: keyStore._id,
      },
      {
        $set: { refreshTokenUsed: tokens.refreshToken },
      }
    );

    await keySchema.updateOne(
      {
        _id: keyStore._id,
      },
      {
        $addToSet: { refreshTokenUsed: refreshToken },
      }
    );
    return {
      user: { userId, email },
      tokens,
    };
  };
}

module.exports = AccessService;
