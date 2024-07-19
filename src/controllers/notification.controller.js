const { SuccessResponse } = require("../core/success.response");
const { pushNotiToSystem } = require("../services/notification.service");
class NotificationController {
  listNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list noti successfully",
      metadata: await pushNotiToSystem(req.query),
    });
  };
}

module.exports = new NotificationController();
