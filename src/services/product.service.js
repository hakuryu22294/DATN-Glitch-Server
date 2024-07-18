"use strict";
const { BadRequestError } = require("../core/error.response");
const { Inventory } = require("../models/inventory.shema");
const {
  product,
  clothing,
  electronic,
  book,
  toy,
  furniture,
} = require("../models/product.schema");
const { insertInventory } = require("../models/repository/inventory.repo");
const {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  unPublishproductByShop,
} = require("../models/repository/product.repo");
const { removeUndifined, updateNestedObjectParser } = require("../utils");
const { pushNotiToSystem } = require("./notification.service");

//define base product
class ProductFactory {
  /*
    type:'Clothing,
    payload
    */
  static productRegistry = {};
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type: ${type}`);
    return new productClass(payload).createProduct();
  }

  static async publishProductByShop({ shop, _id }) {
    return await publishProductByShop({ shop, _id });
  }

  static async findAllDraftsForShop({ shop, limit = 50, skip = 0 }) {
    const query = { shop, isPublished: false };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async unPublishProductByShop({ shop, _id }) {
    return await unPublishproductByShop({ shop, _id });
  }

  //query
  static async findAllPublishForShop({ shop, limit = 50, skip = 0 }) {
    const query = { shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }
  static async searchProducts({ keySearch }) {
    return await searchProductsByUser({ keySearch });
  }
  static async findAllProducts({
    limit = 50,
    skip = 0,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      skip,
      sort,
      page,
      filter,
      select: ["thumb", "name", "price", "shop", "ratingAverage", "quantity"],
    });
  }
  static async findProduct({ _id }) {
    return await findProduct({ _id, unSelect: ["__v"] });
  }
  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type: ${type}`);
    return await new productClass(payload).updateProduct(productId);
  }
}
class Product {
  constructor({
    name,
    thumb,
    description,
    price,
    quantity,
    type,
    shop,
    attributes,
  }) {
    this.name = name;
    this.thumb = thumb;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.type = type;
    this.shop = shop;
    this.attributes = attributes;
  }
  async createProduct(id) {
    const newProduct = await product.create({ ...this, _id: id });
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.shop,
        stock: this.quantity,
      });
      //push noti to system
      // pushNotiToSystem({
      //   type: "SHOP-001",
      //   receiverId: 1,
      //   senderId: this.shop,
      //   options: {
      //     product_name: this.name,
      //     shop_name: this.shop,
      //   },
      // })
      //   .then((rs) => console.log(rs))
      //   .catch((err) => console.log(err));
    }
    return newProduct;
  }
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: product,
    });
  }
}

//define sub-class for different product type

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newClothing) {
      throw new BadRequestError("Can not create product clothing");
    }
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Can not create product");
    }
    return newProduct;
  }
  async updateProduct(productId) {
    const updateNest = updateNestedObjectParser(this);
    const objParams = removeUndifined(updateNest);
    if (objParams.attributes) {
      await updateProductById({
        productId,
        bodyUpdate: objParams,
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(productId, objParams);
    return updateProduct;
  }
}

class Electronic extends Product {
  async updateProduct(productId) {
    const updateNest = updateNestedObjectParser(this);
    const objParams = removeUndifined(updateNest);
    if (objParams.attributes) {
      await updateProductById({
        productId,
        bodyUpdate: objParams,
        model: electronic,
      });
    }
    const updateProduct = await super.updateProduct(productId, objParams);
    return updateProduct;
  }
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.attributes,
      shop: this.shop,
    });
    console.log(newElectronic);
    if (!newElectronic) {
      throw new BadRequestError("Can not create product electronic");
    }
    const newProduct = await super.createProduct(newElectronic._id);
    console.log(newProduct);
    if (!newProduct) {
      throw new BadRequestError("Can not create product");
    }
    return newProduct;
  }
}

class Book extends Product {
  async createProduct() {
    const newBook = await book.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newBook) {
      throw new BadRequestError("Can not create product book");
    }
    const newProduct = await super.createProduct(newBook._id);
    if (!newProduct) {
      throw new BadRequestError("Can not create product");
    }
    return newProduct;
  }
  async updateProduct(productId) {
    const updateNest = updateNestedObjectParser(this);
    const objParams = removeUndifined(updateNest);
    if (objParams.attributes) {
      await updateProductById({
        productId,
        bodyUpdate: objParams,
        model: book,
      });
    }
    const updateProduct = await super.updateProduct(productId, objParams);
    return updateProduct;
  }
}

class Toy extends Product {
  async createProduct() {
    const newToy = await toy.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newToy) {
      throw new BadRequestError("Can not create product toy");
    }
    const newProduct = await super.createProduct(newToy._id);
    if (!newProduct) {
      throw new BadRequestError("Can not create product");
    }
    return newProduct;
  }
  async updateProduct(productId) {
    const updateNest = updateNestedObjectParser(this);
    const objParams = removeUndifined(updateNest);
    if (objParams.attributes) {
      await updateProductById({
        productId,
        bodyUpdate: objParams,
        model: toy,
      });
    }
    const updateProduct = await super.updateProduct(productId, objParams);
    return updateProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newFurniture) {
      throw new BadRequestError("Can not create product furniture");
    }
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError("Can not create product");
    }
    return newProduct;
  }
  async updateProduct(productId) {
    const updateNest = updateNestedObjectParser(this);
    const objParams = removeUndifined(updateNest);
    if (objParams.attributes) {
      await updateProductById({
        productId,
        bodyUpdate: objParams,
        model: furniture,
      });
    }
    const updateProduct = await super.updateProduct(productId, objParams);
    return updateProduct;
  }
}
//register product type
ProductFactory.registerProductType("clothing", Clothing);
ProductFactory.registerProductType("electronic", Electronic);
ProductFactory.registerProductType("book", Book);
ProductFactory.registerProductType("toy", Toy);
ProductFactory.registerProductType("furniture", Furniture);

module.exports = ProductFactory;
