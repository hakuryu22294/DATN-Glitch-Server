const { BadRequestError } = require("../core/error.response");
const {
  findUserByEmailWithLogin,
  createUser,
} = require("../models/repository/user.repo");
const { User } = require("../models/user.schema");
const { sendEmailToken } = require("./email.service");
const bcrypt = require("bcryptjs");
const KeyService = require("./key.service");
const { checkEmailToken } = require("./otp.service");
const crypto = require("crypto");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

class UserService {
  static async newUser({ email = null }) {
    //check email in dbs
    const user = await User.findOne({ email }).lean();
    if (user) {
      throw new BadRequestError("User already exist");
    }
    const result = await sendEmailToken({ email });
    return {
      message: "Verify",
      result,
    };
  }
  static async checkLoginEmailTokenService({ token }) {
    try {
      const { otpEmail, otpToken } = await checkEmailToken({ token });
      if (!otpEmail) throw new BadRequestError("Token not found");
      const userExists = await findUserByEmailWithLogin({ email: otpEmail });
      if (userExists) throw new BadRequestError("User already exist");

      const passwordHash = await bcrypt.hash(otpToken, 10);

      const newUser = await createUser({
        userId: 1,
        userEmail: otpEmail,
        username: otpEmail.split("@")[0],
        password: passwordHash,
        userRole: "user",
      });
      if (newUser) {
        const privateKey = crypto.randomBytes(64).toString("hex"); //save collection key store
        const publicKey = crypto.randomBytes(64).toString("hex"); //save collection key store
        const keyStore = await KeyService.createKeyToken({
          userId: newUser._id,
          publicKey,
          privateKey,
        });
        if (!keyStore) {
          throw new BadRequestError("Can not create key store");
        }
        const tokens = await createTokenPair(
          {
            userId: newUser._id,
            email: otpEmail,
          },
          publicKey,
          privateKey
        );
        return {
          user: getInfoData({
            fields: ["_id", "username", "userEmail", "role"],
            object: newUser,
          }),
          tokens,
        };
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserService;
