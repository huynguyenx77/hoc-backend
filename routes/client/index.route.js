const categoryMiddleWare = require("../../middlewares/client/category.middeware");
const cartMiddleWare = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddeware = require("../../middlewares/client/setting.middleware");
const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");

module.exports = (app) => {
  app.use(categoryMiddleWare.category);
  app.use(userMiddleware.infoUser);
  app.use(cartMiddleWare.cartId);
  app.use(settingMiddeware.settingGeneral);
  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/search", searchRoutes);
  app.use("/cart", cartRoutes);
  app.use("/checkout", checkoutRoutes);
  app.use("/user", userRoutes);
};
