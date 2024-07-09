const keySchema = require("../models/key.schema");

class KeyService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const tokens = await keySchema.create({
        user: userId,
        publicKey,
        privateKey,
      });
      return tokens ? tokens.publicKey : null;
    } catch (err) {
      return err;
    }
  };
}
module.exports = KeyService;
