const { Router } = require("express");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const NotificationController = require("../../controllers/notification.controller");
const amqp = require("amqplib");
const notiRouter = Router();

notiRouter.use(authentication);

notiRouter.get("/list", asyncHandler(NotificationController.listNotiByUser));

module.exports = notiRouter;
