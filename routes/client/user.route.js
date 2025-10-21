const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");
const controller = require("../../controllers/client/user.controller");
const userValidate = require("../../validates/client/user.validate");
const authMiddleWare = require("../../middlewares/client/auth.middleware");
router.get("/register", controller.register);
router.post("/register", userValidate.registerPost, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", userValidate.loginPost, controller.loginPost);
router.get("/logout", controller.logout);
router.get("/password/forgot", controller.forgotPassword);
router.post(
  "/password/forgot",
  userValidate.forgotPassword,
  controller.forgotPasswordPost
);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
router.get("/password/reset", controller.resetPassword);
router.post(
  "/password/reset",
  userValidate.resetPasswordPost,
  controller.resetPasswordPost
);
router.get("/info", authMiddleWare.requireAuth, controller.info);
module.exports = router;
