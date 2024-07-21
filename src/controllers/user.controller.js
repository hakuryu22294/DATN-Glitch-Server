const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
  newUser = async (req, res, next) => {
    new SuccessResponse({
      message: "New user",
      metadata: await UserService.newUser(req.body),
    }).send(res);
  };
}

module.exports = new UserController();
