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
  publishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repository/product.repo");
const { removeUndifined, updateNestedObjectParser } = require("../utils");

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

  static async unPublishProductByShop({ shop, _id }) {
    return await this.unPublishProductByShop({ shop, _id });
  }

  //query
  static async findAllDraftsForShop({ shop, limit = 50, skip = 0 }) {
    const query = { shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
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
      select: ["thumb", "name", "price", "shop"],
    });
  }
  static async findProduct({ _id }) {
    return await findProduct({ _id, unSelect: ["__v"] });
  }
  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type: ${type}`);
    return await productClass(payload).updateProduct(productId);
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
    }
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
    const objParams = removeUndifined(this);
    if (objParams.attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objParams.attributes),
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objParams.attributes)
    );
    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newElectronic) {
      throw new BadRequestError("Can not create product electronic");
    }
    const newProduct = await super.createProduct(newElectronic._id);
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
}
//register product type
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Book", Book);
ProductFactory.registerProductType("Toy", Toy);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
