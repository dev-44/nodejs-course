const Product = require('../models/product');

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    if (products) res.render('shop/index', { prods: products, docTitle: 'Shop', path: '/' });
  } catch (error) {
    console.error(error);
  };
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    if (products) res.render('shop/product-list', { prods: products, docTitle: 'All Products', path: '/products' });
  } catch (error) {
    console.error(error);
  };
};

exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (product) res.render('shop/product-detail', { product, docTitle: product.title, path: '/products' });
  } catch (error) {
    console.error(error);
  };
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    res.render('shop/cart', { path: '/cart', docTitle: 'Your Cart', products: cart });
  } catch (error) {
    console.error(error);
  }

};

exports.postCart = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    try {
      await req.user.addToCart(product);
      res.redirect('/cart')
    } catch (error) {
      console.error(error);
    };
  } catch (error) {
    console.error(error);
  }
};

exports.postCartDeleteItem = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    await req.user.removeFromCart(productId);
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    await req.user.createOrder();
    res.redirect('/orders')
  } catch (error) {
    console.error(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders();
    res.render('shop/orders', { path: '/orders', docTitle: 'Orders', orders})
  } catch (error) {
    console.error(error);
  };
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', { path: '/checkout', docTitle: 'Checkout' });
};