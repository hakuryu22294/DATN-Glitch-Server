const { Created, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    new Created({
      message: "Sign up success",
      metadata: {
        shop: await AccessService.signUp(req.body),
      },
      options: {
        limit: 10,
      },
    }).send(res);
  };
  signIn = async (req, res, next) => {
    new SuccessResponse({
      message: "Sign in success",
      metadata: await AccessService.signIn(req.body),
    }).send(res);
  };
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout success",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Refresh token success",
      metadata: await AccessService.handlerRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
}

module.exports = new AccessController();
