const shopSchema = require("../models/shop.schema");
const bcrypt = require("bcryptjs");
const KeyService = require("./key.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "0001",
  EDITOR: "0002",
  ADMIN: "0003",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //check email exist
      const hodelShop = await shopSchema.findOne({ email }).lean();
      if (hodelShop) {
        return {
          code: "xxx",
          message: "Email already exist",
          status: "error",
        };
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
          return {
            code: "xxx",
            message: "key store errors",
            status: "error",
          };
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
          code: 201,
          message: "Sign up success",
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
