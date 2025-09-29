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

//* [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Role.findOne({
      _id: id,
      deleted: false,
    })
    res.render("admin/pages/role/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      data: data,
    });
  } catch (error) {
    res.redirect(`${prefixAdmin}/roles`);
  }
};


//* [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  try {
    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhập thành công!");
  } catch (error) {
    req.flash("error", "Cập nhập thất bại!");
  }
  res.redirect(req.originalUrl);
};

//* [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const records = await Role.findOne(find);
    res.render("admin/pages/role/detail", {
      pageTitle: records.title,
      records: records,
    });
  } catch (error) {
    res.redirect(`${prefixAdmin}/roles`);
  }
};

//* [DELETE] /admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  try {
    await Role.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );
    req.flash("success", `Đã xóa nhóm quyền thành công!`);
  } catch (error) {
     req.flash("error", `Xóa nhóm quyền không thành công!`);
  }
  res.redirect("/admin/roles");
};

//* [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  }
  const records = await Role.find(find);
  res.render("admin/pages/role/permissions", {
    pageTitle: "Phân quyền",
    records: records,
  });
};
//* [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
  for (const item of permissions) {
    await Role.updateOne({_id: item.id}, {permissions: item.permissions})
  }
  req.flash("success", "Cập nhập phân quyền thành công!");
  res.redirect("/admin/roles/permissions");
};

