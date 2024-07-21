const { BadRequestError } = require("../../core/error.response");
const { User } = require("../user.schema");

const findUserByEmailWithLogin = async ({ email }) => {
  const user = await User.findOne({ userEmail: email }).lean();
  return user;
};

const createUser = async ({ userId, userEmail, username, password, role }) => {
  const user = await User.create({
    userId,
    userEmail,
    password,
    username,
    role,
  });
  return user;
};

module.exports = {
  createUser,
  findUserByEmailWithLogin,
};
