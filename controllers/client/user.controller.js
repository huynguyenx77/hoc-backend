const User = require("../../models/user.models");
const md5 = require("md5");
//* [GET]/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng kí tài khoảng",
  })
}
//* [POST]/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  })
  if(existEmail) {
    req.flash("error", `Email đã tồn tại, vui lòng nhập email khác!`);
    res.redirect(req.get("Referrer"));
    return;
  } 
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
}