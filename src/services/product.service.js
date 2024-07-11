const { BadRequestError } = require("../core/error.response");
const {
  product,
  clothing,
  electronic,
  book,
  toy,
  furniture,
} = require("../models/product.schema");
const {
  findAllDraftsForShop,
  publishProductByShop,
} = require("../models/repository/product.repo");

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

  //query
  static async findAllDraftsForShop({ shop, limit = 50, skip = 0 }) {
    const query = { shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
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
    return await product.create({ ...this, _id: id });
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
