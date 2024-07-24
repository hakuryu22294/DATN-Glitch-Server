const { Category } = require("../category.schema");

const findAllCategorie = async ({ searchValue, parPage, skipPage }) => {
  let categories, total;
  if (searchValue) {
    categories = await Category.find({
      $text: {
        $search: searchValue,
      },
    })
      // .skip(parseInt(skipPage))
      // .limit(parseInt(parPage))
      .sort({ createdAt: -1 });
    total = await Category.countDocuments({
      $text: {
        $search: searchValue,
      },
    });
  } else {
    categories = await Category.find({});
    // .skip(skipPage)
    // .limit(parseInt(parPage))
    // .sort({ createdAt: -1 })
    // .lean();
    total = await Category.find({}).countDocuments();
  }
  return { categories, total };
};

module.exports = { findAllCategorie };
