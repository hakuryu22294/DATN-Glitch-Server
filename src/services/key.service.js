const keySchema = require("../models/key.schema");
const Types = require("mongoose");

class KeyService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      // const tokens = await keySchema.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refeshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keySchema.findByIdAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (err) {
      return err;
    }
  };
  static findByUserId = async (userId) => {
    return await keySchema.findOne({ user: Types.ObjectId(userId) }).lean();
  };
  static removeKeyById = async (id) => {
    return await keySchema.remove(id);
  };
}
module.exports = KeyService;
