const Product = require("../../models/product.models")
const productHelper = require("../../helpers/product")
//* [GET] /
module.exports.index = async (req, res) => {
  // * lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active"
  }).limit(6);
  
  const newProductsFeatured = productHelper.priceNewProducts(productsFeatured);
  // *  hết lấy ra sản phẩm nổi bật

  // *lấy ra sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active"
  }).sort({ position : "desc"}).limit(6)

  const newProductsNew = productHelper.priceNewProducts(productsNew);
  // *hết lấy ra sản phẩm mới nhất


  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};
