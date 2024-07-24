const formidable = require("formidable");
const { cloudinary } = require("../configs/cloudinary.config");
const { BadRequestError } = require("../core/error.response");
const { default: slugify } = require("slugify");
const { SuccessResponse } = require("../core/success.response");
const { findAllCategorie } = require("../models/repo/category.repo");
const { Category } = require("../models/category.schema");

class CategoryController {
  add_category = async (req, res) => {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        throw new BadRequestError("Something went wrong");
      } else {
        console.log(fields, files);
        let { name } = fields;
        let { image } = files;
        name = name.trim();
        const slug = slugify(name, { lower: true });
        const result = await cloudinary.uploader.upload(image.filepath, {
          folder: "categories",
        });
        if (result) {
          const newCategory = await Category.create({
            name,
            image: result.url,
            slug,
          });
          new SuccessResponse({
            message: "Category created successfully",
            data: newCategory,
          }).send(res);
        } else {
          throw new BadRequestError("Category don't created");
        }
      }
    });
  };
  get_all_category = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    let skipPage = 0;
    if (parPage && page) {
      skipPage = parseInt(parPage) * parseInt(page) - 1;
    }
    const newCategories = await findAllCategorie({
      searchValue,
      parPage,
      skipPage,
    });
    console.log(newCategories);
    if (!newCategories) {
      throw new BadRequestError("Category don't found");
    }

    new SuccessResponse({
      message: "Get all category successfully",
      data: newCategories,
    }).send(res);
  };
}

module.exports = new CategoryController();
