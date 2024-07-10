const shopSchema = require("../models/shop.schema");
const bcrypt = require("bcryptjs");
const KeyService = require("./key.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  UnauthorizedError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "0001",
  EDITOR: "0002",
  ADMIN: "0003",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    //check email exist
    const hodelShop = await shopSchema.findOne({ email }).lean();
    if (hodelShop) {
      throw new BadRequestError("Shop already exist");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newShop = new shopSchema({
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
    await KeyService.createKeyToken({
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
}

module.exports = AccessService;
