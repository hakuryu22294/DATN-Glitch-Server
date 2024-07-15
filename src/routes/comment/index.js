const { Router } = require("express");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const CommentController = require("../../controllers/comment.controller");

const commentRouter = Router();
commentRouter.use(authentication);
commentRouter.post(
  "/",
  authentication,
  asyncHandler(CommentController.createComment)
);
commentRouter.get("/", asyncHandler(CommentController.getCommentsByParentId));

commentRouter.delete("/", asyncHandler(CommentController.deleteComents));

module.exports = commentRouter;
