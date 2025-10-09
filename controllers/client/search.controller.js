const Product = require("../../models/product.models")
const productHelper = require("../../helpers/product");
//* [GET] /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  let newProducts = [];
  if(keyword){  
    const keywordRegex = new RegExp(keyword, "i"); //* tìm theo từ khóa, i là không phân biệt chữ hoa hay thường
    const products = await Product.find({
      title: keywordRegex,
      status: "active",
      deleted: false,
    })
    newProducts = productHelper.priceNewProducts(products);
  }
  res.render("client/pages/search/index", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts,
  });
};
