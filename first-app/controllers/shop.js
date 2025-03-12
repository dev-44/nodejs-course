const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', { prods: products, docTitle: 'Shop', path: '/' });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', { prods: products, docTitle: 'All Products', path: '/products' });
  });
};

exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  res.render('shop/product-detail', { product, docTitle: product.title, path: '/products' });
};

exports.getCart = async (req, res, next) => {
  const cart = await Cart.getCartProducts();
  Product.fetchAll(products => {
    const cartProducts = [];
    for (let product of products) {
      const productData = cart.products.find(prod => prod.id === product.id);
      if (productData ) {
        cartProducts.push({ productData: product, qty: productData.qty})
      }
    }
    res.render('shop/cart', { path: '/cart', docTitle: 'Your Cart', products: cartProducts });
  })
};

exports.postCart = async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  await Cart.addProduct(productId, product.price);
  res.redirect('/cart')
};

exports.postCartDeleteItem = async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  await Cart.deleteProduct(productId, product.price);
  res.redirect('/cart');
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', { path: '/checkout', docTitle: 'Checkout' });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', { path: '/orders', docTitle: 'Orders'})
};