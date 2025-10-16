const { set } = require("mongoose");
const systemConfig = require("../../config/system");
const prefixAdmin = systemConfig.prefixAdmin;
const SettingGeneral = require("../../models/setting-general.model");

//* [GET] /admin/accounts
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  res.render("admin/pages/setting/general", {
    pageTitle: "Cài đặt chung",
    settingGeneral: settingGeneral,
  });
};
//* [GET] /admin/accounts
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});

  if(settingGeneral){
    await SettingGeneral.updateOne({
      _id: settingGeneral.id,
    }, req.body)
  } else {
    const record = new SettingGeneral(req.body);
    await record.save();
  }
  req.flash("success", "Cập nhập thành công")
  res.redirect(req.get("Referrer"));
};
