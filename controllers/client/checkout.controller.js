const Cart = require("../../models/cart.model");
const Product = require("../../models/product.models");
const Order = require("../../models/order.models");

const priceNewHelper = require("../../helpers/product");
//* [GET] /checkout/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId,
  });
  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      });
      productInfo.priceNew = priceNewHelper.priceNewProduct(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = item.quantity * productInfo.priceNew;
    }
  }
  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  res.render("client/pages/checkout/index", {
    pageTitle: "Trang thanh toán",
    cartDetail: cart,
  });
};

//* [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  let products = [];
  for (const item of cart.products) {
    const objectProduct = {
      product_id: item.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: item.quantity,
    };
    const productInfo = await Product.findOne({
      _id: item.product_id,
    });
    const productId = productInfo.id;
    //*cập nhập lại số lượng hàng còn lại
    await Product.updateOne(
      { _id: item.product_id },
      { stock: productInfo.stock - item.quantity }
    );
    //*end cập nhập lại số lượng hàng còn lại

    objectProduct.price =
      productInfo.price * (1 - productInfo.discountPercentage / 100);
    objectProduct.discountPercentage = productInfo.discountPercentage;
    products.push(objectProduct);
  }

  const objectOrder = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  };
  const order = new Order(objectOrder);
  await order.save();

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      products: [],
    }
  );
  res.redirect(`/checkout/success/${order.id}`);
}

//* [GET] /checkout/success/:id
module.exports.success = async (req, res) => {
  // console.log(req.params.orderId);
  const order = await Order.findOne({
    _id: req.params.orderId
  })
  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");
    product.productInfo = productInfo;
    product.priceNew = priceNewHelper.priceNewProduct(product);
    product.totalPrice = product.priceNew * product.quantity;
  }
  order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);
  res.render("client/pages/checkout/success", {
    pageTitle: "Trang thanh toán thành công",
    order: order,
  });
};