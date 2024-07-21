const { BadRequestError } = require("../core/error.response");
const {
  findUserByEmailWithLogin,
  createUser,
} = require("../models/repository/user.repo");
const { User } = require("../models/user.schema");
const { sendEmailToken } = require("./email.service");
const bcrypt = require("bcryptjs");
const { checkEmailToken } = require("./otp.service");
const crypto = require("crypto");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
require("dotenv").config();

class UserService {
  static async newUser({ email = null, password }) {
    //check email in dbs
    const user = await User.findOne({ email }).lean();
    if (user) {
      throw new BadRequestError("User already exist");
    }
    const result = await sendEmailToken({ email, password });
    return {
      message: "Verify",
      result,
    };
  }
  static async checkLoginEmailTokenService({ token }) {
    try {
      const { otpEmail, otpToken, optPassword } = await checkEmailToken({
        token,
      });
      if (!otpEmail) throw new BadRequestError("Token not found");
      const userExists = await findUserByEmailWithLogin({ email: otpEmail });
      if (userExists) throw new BadRequestError("User already exist");
      const passwordHash = await bcrypt.hash(optPassword, 10);

      const newUser = await createUser({
        email: otpEmail,
        username: otpEmail.split("@")[0],
        password: passwordHash,
        status: "active",
      });
      if (newUser) {
        const tokens = await createTokenPair({
          userId: newUser._id,
          email: otpEmail,
        });
        return {
          user: getInfoData({
            fields: ["_id", "username", "email", "role"],
            object: newUser,
          }),
          tokens,
        };
      }
    } catch (err) {
      throw err;
    }
  }
  static async signIn({ email, password }) {
    //check email in dbs
    const foundUser = await findUserByEmailWithLogin({ email });
    if (!foundUser) throw new BadRequestError("User not registered");
    //match password
    const matchPassword = await bcrypt.compare(password, foundUser.password);
    if (!matchPassword) throw new BadRequestError("Wrong password");
    const tokens = await createTokenPair(
      {
        userId: foundUser._id,
        email,
      },
      process.env.SECRET_KEY
    );
    return {
      user: foundUser,
      tokens,
    };
  }
}

module.exports = UserService;
