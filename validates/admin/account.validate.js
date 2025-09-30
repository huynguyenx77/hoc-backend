module.exports.createPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `Vui lòng nhập tên!`);
    res.redirect(req.originalUrl);
    return;
  }
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email!`);
    res.redirect(req.originalUrl);
    return;
  }
  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu!`);
    res.redirect(req.originalUrl);
    return;
  }
  next();
};

module.exports.editPatch = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `Vui lòng nhập tên!`);
    res.redirect(req.originalUrl);
    return;
  }
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email!`);
    res.redirect(req.originalUrl);
    return;
  }
  next();
};

