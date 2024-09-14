const formidable = require("formidable");
const { cloudinary } = require("../configs/cloudinary.config");
const {
  findProductByName,
  findAllProduct,
  findProductById,
} = require("../models/repo/product.repo");
const { BadRequestError } = require("../core/error.response");
const { Product } = require("../models/product.schema");
const { Seller } = require("../models/seller.schema");
const { SuccessResponse } = require("../core/success.response");
const { default: slugify } = require("slugify");
class ProductController {
  async add_product(req, res) {
    const { id } = req.user;
    console.log(id);
    const shop = await Seller.findOne({ userId: id });

    const {
      name,
      category,
      description,
      stock,
      price,
      discount,
      brand,
      images,
    } = req.body;

    // Validate and process fields
    if (!images || images.length === 0)
      throw new BadRequestError("Images are required");

    const findProduct = await findProductByName({ name });

    if (findProduct) {
      throw new BadRequestError("Product already exists");
    }

    const newProduct = await Product.create({
      sellerId: shop._id,
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      stock: parseInt(stock),
      discount: parseInt(discount),
      price: parseInt(price),
      images: images,
      brand: brand.trim(),
      slug: slugify(name, { lower: true }),
    });

    if (!newProduct) {
      throw new BadRequestError("Product not created");
    }

    new SuccessResponse({
      message: "Product created successfully",
      data: newProduct,
    }).send(res);
  }

  get_products_by_shop = async (req, res) => {
    const { sellerId } = req.params;
    console.log(sellerId);
    const shop = await Seller.findOne({ _id: sellerId });
    const products = await Product.find({ sellerId });
    new SuccessResponse({
      message: "Get products successfully",
      data: { products, shop },
    }).send(res);
  };

  async upload_images_product(req, res) {
    console.log(req.user);
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(400).json({ message: "Error parsing files" });

      const { image } = files;
      const result = await cloudinary.uploader.upload(image.filepath, {
        folder: "products",
        transformations: [{ width: 500, height: 500, crop: "fill" }],
      });
      if (!result) throw new BadRequestError("Upload image failed");
      new SuccessResponse({
        message: "Upload image successfully",
        data: result.secure_url,
      }).send(res);
    });
  }

  async get_product(req, res) {
    const { page, searchValue, parPage } = req.query;
    const { id } = req.user;
    const seller = await Seller.findOne({ userId: id });
    const skipPage = parseInt(parPage) * (parseInt(page) - 1);
    console.log(searchValue);
    const { products, total } = await findAllProduct({
      parPage,
      sellerId: seller._id,
      searchValue,
      skipPage,
    });
    new SuccessResponse({
      message: "Get product successfully",
      data: { products, total },
    }).send(res);
  }
  async get_one_product(req, res) {
    const { productId } = req.params;
    console.log(productId);
    const product = await findProductById(productId);
    if (!product) throw new BadRequestError("Product not found");
    new SuccessResponse({
      message: "Get product successfully",
      data: product,
    }).send(res);
  }

  async update_product(req, res) {
    let { fieldsToUpdate, productId } = req.body;

    const findProduct = await findProductById({ _id: productId });
    if (!findProduct) throw new BadRequestError("Product not found");
    const { name, description, stock, price, discount, brand, status } =
      fieldsToUpdate;
    let updatedFields = {};

    if (name && name.trim()) {
      updatedFields.name = name.trim();
      updatedFields.slug = slugify(name.trim(), { lower: true });
    }

    if (description) updatedFields.description = description;

    if (stock) {
      updatedFields.stock = findProduct.stock + parseInt(stock);
    }
    if (price) updatedFields.price = price;
    if (discount) updatedFields.discount = discount;
    if (brand) updatedFields.brand = brand;
    if (status) updatedFields.status = status;
    const updateProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      updatedFields,
      { new: true }
    );

    new SuccessResponse({
      message: "Update product successfully",
      data: updateProduct,
    }).send(res);
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
  async update_sub_category(req, res) {
    const { productsIds, subCategory } = req.body;
    if (!productsIds || productsIds.length === 0) {
      throw new BadRequestError("Products Ids are not required");
    }
    if (!subCategory) {
      throw new BadRequestError("Sub category is not required");
    }
    const products = await Product.updateMany(
      { _id: { $in: productsIds } },
      { subCategory }
    );
    console.log(products, subCategory);
    if (!products) throw new BadRequestError("Update sub category failed");
    new SuccessResponse({
      message: "Update sub category successfully",
      data: products,
    }).send(res);
  }
}

module.exports = new ProductController();
