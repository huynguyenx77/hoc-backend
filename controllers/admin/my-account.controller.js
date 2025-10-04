const md5 = require("md5");
const Acounts = require("../../models/account.models");
const systemConfig = require("../../config/system");
const prefixAdmin = systemConfig.prefixAdmin;
//* [GET] /admin/my-account
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Trang tổng quan",
  });
};

//* [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Trang chỉnh sửa thông tin cá nhân",
  });
};

//* [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;
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
    req.flash("success", "Cập nhập thông tin tài khoảng thành công");
  }
  res.redirect(`${prefixAdmin}/my-account/edit/`);
};
