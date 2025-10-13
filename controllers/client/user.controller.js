const User = require("../../models/user.models");
const ForgotPassword = require("../../models/forgot-password.models");

const genarateHelper = require("../../helpers/genarate");
const md5 = require("md5");
//* [GET]/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng kí tài khoảng",
  });
};
//* [POST]/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (existEmail) {
    req.flash("error", `Email đã tồn tại, vui lòng nhập email khác!`);
    res.redirect(req.get("Referrer"));
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};
//* [GET]/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoảng",
  });
};
//* [POST]/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", `Email không tồn tại`);
    res.redirect(req.get("Referrer"));
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", `Sai mật khẩu`);
    res.redirect(req.get("Referrer"));
    return;
  }
  if (user.status == "inactive") {
    req.flash("error", `Tài khoảng đã bị khóa`);
    res.redirect(req.get("Referrer"));
    return;
  }
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};

//* [GET]/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};

//* [GET]/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

//* [POST]/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect(req.get("Referrer"));
    return;
  }
  //* Nếu có email thì
  //* Việc 1: Tạo mã OTP và lưu OTP, email vào trong connection
  const otp = genarateHelper.generateRamdomNumber(8);
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  forgotPassword.save();
  //* Việc 2:  Gửi mã OTP qua email cho user
  res.redirect(`/user/password/otp?email=${email}`);
};

//* [GET]/password/forgot
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};

//* [POST]/password/forgot
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  console.log({
    email: email,
    otp: otp,
  });
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    req.flash("error", "OTP không hợp lệ");
    res.redirect(req.get("Referrer"));
    return;
  }
  const user = await User.findOne({
    email: email,
  });
  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};
