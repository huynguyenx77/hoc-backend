const Role = require("../../models/roles.models")
const systemConfig = require("../../config/system");
const prefixAdmin = systemConfig.prefixAdmin;
//* [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  }
  const records = await Role.find(find);
  res.render("admin/pages/role/index", {
    pageTitle: "Nhóm quyền",
    records: records,
  });
};

//* [GET] /admin/roles/create
module.exports.create = async (req, res) => {

  res.render("admin/pages/role/create", {
    pageTitle: "Tạo nhóm quyền",
  });
};

//* [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const records = new Role(req.body);
  await records.save();
  res.redirect(`${prefixAdmin}/roles`)
};
