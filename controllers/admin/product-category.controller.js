const productsCategory = require("../../models/product-category.models")
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const prefixAdmin = systemConfig.prefixAdmin;
//* [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  let find = {
    deleted: false,
  };
  const record = await productsCategory.find(find);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    record: record,
    filterStatus: filterStatus,
  });
};

//* [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  
  res.render("admin/pages/products-category/create", {
    pageTitle: "Danh mục sản phẩm",
  });
};

//* [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await productsCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  const record = new productsCategory(req.body);
  await record.save();
  res.redirect(`${prefixAdmin}/products-category`);
};



