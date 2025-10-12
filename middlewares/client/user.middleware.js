const User = require("../../models/user.models");
module.exports.infoUser = async (req, res, next) => {
  if (req.cookies.tokenUser) {
    const infoUser = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
    }).select("-password");

    if (infoUser) {
      res.locals.user = infoUser;
    }
  }

  next();
};
