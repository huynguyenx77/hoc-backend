const md5 = require("md5");
const Acounts = require("../../models/account.models");
const systemConfig = require("../../config/system");
const prefixAdmin = systemConfig.prefixAdmin;
//* [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Trang đăng nhập",
  });
};
//* [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await Acounts.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect(`${prefixAdmin}/auth/login`);
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", "Mật khẩu không đúng");
    res.redirect(`${prefixAdmin}/auth/login`);
    return;
  }
  if (user.status != "active") {
    req.flash("error", "Tài khoảng đã bị khóa");
    res.redirect(`${prefixAdmin}/auth/login`);
    return;
  }
  res.cookie("token", user.token)
  res.redirect(`${prefixAdmin}/dashboard`);
};
