const categoryMiddleWare = require("../../middlewares/client/category.middeware");
const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");

module.exports = (app) => {
  app.use(categoryMiddleWare.category)
  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
};
