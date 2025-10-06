const ProductCategory = require("../../models/product-category.models");
const systemConfig = require("../../config/system");
const prefixAdmin = systemConfig.prefixAdmin;
const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
  const productsCategory = await ProductCategory.find({
    deleted: false,
  });
  const newProductsCategory = createTreeHelper.tree(productsCategory);

  res.locals.layoutProductsCategory = newProductsCategory
  next();
};
