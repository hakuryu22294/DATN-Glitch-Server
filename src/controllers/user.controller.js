const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
  newUser = async (req, res, next) => {
    new SuccessResponse({
      message: "New user",
      metadata: await UserService.newUser({
        email: req.body.email,
      }),
    }).send(res);
  };
  checkLoginEmailToken = async (req, res, next) => {
    const { token = null } = req.query;
    const respon = await UserService.checkLoginEmailTokenService({ token });
    new SuccessResponse({
      message: "Verified Success",
      metadata: respon,
    }).send(res);
  };
}

module.exports = new UserController();
