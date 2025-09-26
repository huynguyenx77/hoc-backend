const productsCategory = require("../../models/product-category.models");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const prefixAdmin = systemConfig.prefixAdmin;
const createTreeHelper = require("../../helpers/createTree");
//* [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //*pagination

  const countProduct = await productsCategory.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItem: 4,
    },
    req.query,
    countProduct
  );

  //*end pagination

  //* sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  //* end sort

  const record = await productsCategory
    .find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  const newRecords = createTreeHelper.tree(record);
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    record: newRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// * [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await productsCategory.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhập trạng thái thành công!");

  res.redirect(req.get("Referrer") || "/admin/products-category");
};

//* [PATCH] /admin/products/change-status/:status/:id
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await productsCategory.updateMany(
        { _id: { $in: ids } },
        { status: "active" }
      );
      req.flash(
        "success",
        `Cập nhập trạng thái ${ids.length} sản phẩm thành công!`
      );
      break;
    case "inactive":
      await productsCategory.updateMany(
        { _id: { $in: ids } },
        { status: "inactive" }
      );
      req.flash(
        "success",
        `Cập nhập trạng thái ${ids.length} sản phẩm thành công!`
      );
      break;
    case "delete-all":
      await productsCategory.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      req.flash("success", `Đã xóa ${ids.length} sản phẩm thành công!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await productsCategory.updateOne(
          { _id: id },
          {
            position: position,
          }
        );
      }
      req.flash(
        "success",
        `Đã cập nhập vị trí ${ids.length} sản phẩm thành công!`
      );
      break;
    default:
      break;
  }
  res.redirect(req.get("Referrer") || "/admin/products-category");
};

//* [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await productsCategory.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );
  req.flash("success", `Đã xóa sản phẩm thành công!`);
  res.redirect(req.get("Referrer") || "/admin/products-category");
};

//* [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const data = await productsCategory.findOne(find);
    // *lấy danh mục cha--------------------------
    const records = await productsCategory.find({
      deleted: false,
    });
    const newRecords = createTreeHelper.tree(records);
    //*--------------------------------------------
    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${prefixAdmin}/products-category`);
  }
};

//* [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.position = parseInt(req.body.position);

  if (!req.body.thumbnail) {
    req.body.thumbnail = productsCategory.thumbnail;
  }
  try {
    await productsCategory.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Cập nhập thành công!");
  } catch (error) {
    req.flash("success", "Cập nhập thành công!");
  }
  res.redirect(req.originalUrl);
};

//* [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const record = await productsCategory.findOne(find);
    res.render("admin/pages/products-category/detail", {
      pageTitle: record.title,
      record: record,
    });
  } catch (error) {
    res.redirect(`${prefixAdmin}/products-category`);
  }
};

//* [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };
  

  const records = await productsCategory.find(find);
  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
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
