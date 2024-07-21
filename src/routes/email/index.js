const { Router } = require("express");
const EmailController = require("../../controllers/email.controller");

const emailRouter = Router();
const { asyncHandler } = require("../../helpers/asyncHandler");

emailRouter.post("/new-template", asyncHandler(EmailController.newTemplate));

module.exports = emailRouter;
