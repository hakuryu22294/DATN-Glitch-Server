const { NotFoundError } = require("../core/error.response");
const { Comment } = require("../models/comment.shema");
const { findProduct } = require("../models/repository/product.repo");
const { convertToObjectId } = require("../utils");

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      product: productId,
      user: userId,
      content,
      commentParentId: parentCommentId,
    });
    let rightValue;
    if (parentCommentId) {
      //reply comment
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("Parent comment not found");
      const rightValue = parentComment.commentRight;
      await Comment.updateMany(
        {
          product: convertToObjectId(productId),
          commentRight: { $gte: rightValue },
        },
        {
          $inc: { commentRight: 2 },
        }
      );
      await Comment.updateMany(
        {
          product: convertToObjectId(productId),
          commentLeft: { $gt: rightValue },
        },
        {
          $inc: { commentLeft: 2 },
        }
      );
    } else {
      const maximumRightValue = await Comment.findOne(
        {
          product: convertToObjectId(productId),
        },
        "comment_right",
        {
          sort: { comment_right: -1 },
        }
      );
      if (maximumRightValue) {
        rightValue = maximumRightValue.commentRight + 1;
      } else {
        rightValue = 1;
      }
    }
    //insert to comment
    comment.commentLeft = rightValue;
    comment.commentRight = rightValue + 1;
    await comment.save();
    return comment;
  }
  static async getCommentByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) throw new NotFoundError("Parent comment not found");
      const commnets = await Comment.find({
        product: convertToObjectId(productId),
        commentLeft: { $gt: parent.commentLeft },
        commentRight: { $lte: parent.commentRight },
      })
        .select({
          commentLeft: 1,
          commentRight: 1,
          content: 1,
          commentParentId: 1,
        })
        .sort({
          commentLeft: 1,
        });
      return commnets;
    }
    const commnets = await Comment.find({
      product: convertToObjectId(productId),
      commentParentId: convertToObjectId(parentCommentId),
    })
      .select({
        commentLeft: 1,
        commentRight: 1,
        content: 1,
        commentParentId: 1,
      })
      .sort({
        commentLeft: 1,
      });
    return commnets;
  }
  static async deleteComments({ commentId, productId }) {
    //check the product exist in the dbs
    const foundProduct = await findProduct({ _id: productId });
    if (!foundProduct) throw new NotFoundError("Product not found");

    //check left and right
    const comment = await Comment.findById(commentId);
    if (!comment) throw new NotFoundError("Comment not found");
    const leftValue = comment.commentLeft;
    const rightValue = comment.commentRight;
    // calc width
    const width = rightValue - leftValue + 1;
    // delete all comments child
    await Comment.deleteMany({
      product: convertToObjectId(productId),
      commentLeft: {
        $gte: leftValue,
        $lte: rightValue,
      },
    });
    // update left and right
    await Comment.updateMany(
      {
        product: convertToObjectId(productId),
        commentLeft: { $gt: leftValue },
        commentRight: { $gt: rightValue },
      },
      {
        $inc: { commentLeft: -width, commentRight: -width },
      }
    );
  }
}

module.exports = CommentService;
