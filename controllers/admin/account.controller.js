const md5 = require("md5");
const Acounts = require("../../models/account.models");
const Roles = require("../../models/roles.models");
const systemConfig = require("../../config/system");
const Role = require("../../models/roles.models");

const prefixAdmin = systemConfig.prefixAdmin;
//* [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Acounts.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }
  res.render("admin/pages/account/index", {
    pageTitle: "Danh sách tài khoảng",
    records: records,
  });
};

//* [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Roles.find({
    deleted: false,
  });
  res.render("admin/pages/account/create", {
    pageTitle: "Tạo tài khoảng",
    roles: roles,
  });
};

//* [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emaiExist = await Acounts.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emaiExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect(req.originalUrl);
  } else {
    req.body.password = md5(req.body.password); //*mã hóa mật khẩu
    const records = new Acounts(req.body);
    await records.save();
    res.redirect(`${prefixAdmin}/accounts`);
  }
};

//* [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    deleted: false,
    _id: req.params.id,
  };
  try {
    const accounts = await Acounts.findOne(find);
    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/account/edit", {
      pageTitle: "Chỉnh sửa tài khoảng",
      accounts: accounts,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${prefixAdmin}/accounts`);
  }
};

//* [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const emaiExist = await Acounts.findOne({
    _id: { $ne: id }, //* cú pháp {$ne: ..} là ngoại trừ cái gì đó 
    email: req.body.email,
    deleted: false,
  });
  if (emaiExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Acounts.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhập tài khoảng thành công");
  }
  res.redirect(`${prefixAdmin}/accounts/edit/${id}`);
};
