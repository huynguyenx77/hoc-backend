const Product = require("../../models/product.models")
const productHelper = require("../../helpers/product")
//* [GET] /
module.exports.index = async (req, res) => {
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active"
  }).limit(6);
  
  const newProducts = productHelper.priceNewProducts(productsFeatured);
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProducts
  });
};
