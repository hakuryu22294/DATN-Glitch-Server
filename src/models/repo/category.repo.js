const findAllCategorie = async ({ searchValue, parPage, skipPage }) => {
  let categories, total;
  if (searchValue) {
    categories = await Category.find({
      $text: {
        $search: searchValue,
      }
        .skip(skipPage)
        .limit(parPage)
        .sort({ createdAt: -1 }),
    }).lean();
    total = await Category.countDocuments({
      $text: {
        $search: searchValue,
      },
    }).countDocuments();
  } else {
    categories = await Category.find({})
      .skip(skipPage)
      .limit(parseInt(parPage))
      .sort({ createdAt: -1 })
      .lean();
    total = await Category.countDocuments().countDocuments();
  }
  return { categories, total };
};

module.exports = { findAllCategorie };
