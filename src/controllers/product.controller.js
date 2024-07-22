const formidable = require("formidable");
const { cloudinary } = require("../configs/cloudinary.config");
const {
  findProductByName,
  findAllProduct,
  findProductById,
} = require("../models/repo/product.repo");
const { BadRequestError } = require("../core/error.response");
const { Product } = require("../models/product.schema");
const { parseInt } = require("lodash");
const { SuccessResponse } = require("../core/success.response");
const { default: slugify } = require("slugify");
class ProductController {
  async add_product(req, res) {
    const { id } = req;
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      let {
        name,
        category,
        description,
        stock,
        price,
        discount,
        shopName,
        brand,
      } = fields;
      name = name.trim();
      const { images } = files;
      let allImgUrl = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i].filepath, {
          folder: "products",
        });
        allImgUrl = [...allImgUrl, result.url];
      }

      const findProduct = await findProductByName({ name });

      if (findProduct) throw new BadRequestError("Product already exists");

      const newProduct = await Product.create({
        sellerId: id,
        name,
        shopName,
        category: category.trim(),
        description: description.trim(),
        stock: parseInt(stock),
        discount: parseInt(discount),
        price: parseInt(price),
        images: allImgUrl,
        brand: brand.trim(),
      });
      if (!newProduct) throw new BadRequestError("Product don't created");
      new SuccessResponse({
        message: "Product created successfully",
        data: newProduct,
      }).send(res);
    });
  }

  async get_product(req, res) {
    const { page, searchValue, parPage } = req.query;
    const { id } = req;
    const skipPage = parseInt(parPage) * parseInt(page) - 1;

    const { products, total } = await findAllProduct({
      parPage,
      sellerId: id,
      searchValue,
      skipPage,
    });
    new SuccessResponse({
      message: "Get product successfully",
      data: { products, total },
    });
  }
  async get_one_product(req, res) {
    const { productId } = req.params;
    const product = await findProductById({ id: productId });
    new SuccessResponse({
      message: "Get product successfully",
      data: product,
    }).send(res);
  }

  async update_product(req, res) {
    let { name, description, stock, price, discount, brand, productId } =
      req.body;
    name = name.trim();
    slug = slugify(name, { lower: true });
    const findProduct = await findProductById({ _id: productId });

    if (!findProduct) throw new BadRequestError("Product not found");
    const updateProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      {
        name,
        slug,
        description,
        stock,
        price,
        discount,
        brand,
      }
    );

    new SuccessResponse({
      message: "Update product successfully",
      data: updateProduct,
    });
  }
  async product_img_update(req, res) {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      const { productId, oldImage } = fields;
      const { newImage } = files;
      if (err) {
        throw new BadRequestError(err.message);
      } else {
        const result = await cloudinary.uploader.upload(newImage.filepath, {
          folder: "products",
        });
      }
      if (result) {
        let { images } = await findProductById({ _id: productId });
        const index = images.findIndex((img) => img === oldImage);
        images[index] = result.url;
        const productUpdated = await Product.findByIdAndUpdate(
          { _id: productId },
          { images }
        );

        new SuccessResponse({
          message: "Update product image successfully",
          data: productUpdated,
        }).send(res);
      } else {
        throw new BadRequestError("Image not found");
      }
    });
  }
}

module.exports = new ProductController();
