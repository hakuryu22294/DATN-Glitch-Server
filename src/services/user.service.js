const { BadRequestError } = require("../core/error.response");
const { User } = require("../models/user.schema");
const { sendEmailToken } = require("./email.service");

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
}

module.exports = UserService;
