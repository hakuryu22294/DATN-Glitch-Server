/**
 * 1 - Generate discount code [Role: Shop, Admin]
 * 2 - Get discount amount [Role: User]
 * 3 - Get all discount code [Role: User, Shop]
 * 4 -  Verify discount [Role: User]
 * 5 - Delete discount code [Role: Admin, Shop]
 * 6 - Cancel discount [Role: User]
 */

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { Discount } = require("../models/discount.schema");
const { findAllProducts } = require("../models/repository/product.repo");
const { convertToObjectId } = require("../utils");
const {
  findAllDiscountCodeUnSelect,
  checkDiscountExists,
} = require("../models/repository/discount.repo");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      startDate,
      endDate,
      isActive,
      shop,
      minOrderValue,
      applicabeProducts,
      name,
      description,
      value,
      maxUses,
      usesCount,
      appliesTo,
      maxUsesPerUser,
      type,
    } = payload;
    if (new Date() > new Date(endDate)) {
      throw new BadRequestError("Invalid date");
    }
    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestError("Start date must be less than end date");
    }
    const foundDiscount = await Discount.findOne({
      code,
      shop: convertToObjectId(shop),
    });
    if (foundDiscount && foundDiscount.isActive) {
      throw new BadRequestError("Discount code already exist");
    }
    const newDiscount = await Discount.create({
      code,

      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive,
      type: type || "fixed_amount",
      shop: convertToObjectId(shop),
      minOrderValue,
      applicabeProducts: appliesTo === "all" ? [] : applicabeProducts,
      name,
      description,
      value,
      maxUses,
      usesCount,
      appliesTo,
      maxUsesPerUser,
    });

    return newDiscount;
  }
  static updateDiscountCode() {}

  static async getAllDisCountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await Discount.findOne({
      code,
      shop: convertToObjectId(shopId),
    }).lean();
    if (!foundDiscount || !foundDiscount.isActive)
      throw new BadRequestError("Discount code not found");
    const { appliesTo, applicabeProducts } = foundDiscount;
    let products;
    if (appliesTo === "all") {
      //get all
      products = await findAllProducts({
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["name"],
        filter: { shop: convertToObjectId(shopId), isPublished: true },
      });
    }
    //get product applies
    if (appliesTo === "specific") {
      products = await findAllProducts({
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["name"],
        filter: {
          _id: { $in: applicabeProducts },
          isPublished: true,
        },
      });
    }
    return products;
  }
  static async getAllDiscountByShop({ shopId, limit, page }) {
    const discounts = await findAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        shop: convertToObjectId(shopId),
        isActive: true,
      },
      unSelect: ["__v", "shop"],
      model: Discount,
    });

    return discounts;
  }
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: Discount,
      filter: {
        code: codeId,
        shop: convertToObjectId(shopId),
      },
    });
    if (!foundDiscount) throw new NotFoundError("Discount code not found");
    const {
      isActive,
      maxUses,
      startDate,
      endDate,
      minOrderValue,
      userUsed,
      type,
      maxUsesPerUser,
    } = foundDiscount;
    if (!isActive) throw new BadRequestError("Discount code not active");
    if (!maxUses) throw new BadRequestError("Discount are out of uses");
    if (new Date() > new Date(endDate))
      throw new BadRequestError("Discount code expired");
    let totalOrder = 0;
    if (minOrderValue > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);
      if (totalOrder < minOrderValue)
        throw new BadRequestError(
          `Discount require min order value of ${minOrderValue}`
        );
    }
    if (maxUsesPerUser > 0) {
      const userUserDiscount = userUsed.find(
        (user) => user._id.toString() === userId
      );
      if (userUserDiscount)
        throw new BadRequestError("User already used discount code");
    }
    const amount =
      type === "fixed_amount"
        ? foundDiscount.value
        : totalOrder * (foundDiscount.value / 100);
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }
  static async deleteDiscountCode({ codeId, shopId }) {
    const deleted = await Discount.findOneAndDelete({
      code: codeId,
      shop: convertToObjectId(shopId),
    });
    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: Discount,
      filter: {
        code: codeId,
        shop: convertToObjectId(shopId),
      },
    });
    if (!foundDiscount) throw new NotFoundError("Discount does not exist");

    const result = await Discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: { userUsed: convertToObjectId(userId) },
      $inc: {
        maxUses: 1,
        usesCount: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
