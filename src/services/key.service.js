const keySchema = require("../models/key.schema");
const Types = require("mongoose");

class KeyService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keySchema.findOneAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (err) {
      return err;
    }
  };
  static findByUserId = async (userId) => {
    return await keySchema.findOne({ user: userId }).lean();
  };
  static removeKeyById = async (id) => {
    return await keySchema.deleteOne(id);
  };

  static deleteKeyById = async (userId) => {
    return await keySchema.findByIdAndDelete({ user: userId });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keySchema.findOne({ refreshTokenUsed: refreshToken }).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keySchema.findOne({ refreshToken });
  };
}
module.exports = KeyService;
