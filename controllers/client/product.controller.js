const Product = require("../../models/product.models");
const ProductCategory = require("../../models/product-category.models");

const productHelper = require("../../helpers/product");
const productCategoryHelper = require("../../helpers/product-category");
//* [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productHelper.priceNewProducts(products);
  res.render("client/pages/products/index", {
    pageTitle: "Trang danh sách sản phẩm",
    products: newProducts,
  });
};

//* [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };

    const product = await Product.findOne(find);
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      products: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};

//* [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false,
  });

  const listSubCategory = await productCategoryHelper.setSubCategory(category.id);

  const listSubCategoryId = listSubCategory.map(item => item.id);

  const products = await Product.find({
    products_category_id: { $in: [category.id, ...listSubCategoryId] },
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productHelper.priceNewProducts(products);
  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: newProducts,
  });
};
