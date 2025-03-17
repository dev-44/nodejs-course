const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', { docTitle: 'Add Product', path: '/admin/add-product' })
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, price, description, null, req.user._id);
  await product.save();
  res.redirect('/admin/products');
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    res.render('admin/edit-product', { docTitle: 'Edit Product', path: '/admin/edit-product', product })
  } catch (error) {
    console.error('Error fetching product:', error);
  }

};

exports.postEditProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const { title, imageUrl, price, description } = req.body
  const product = new Product(title, imageUrl, price, description, productId);
  await product.editProduct();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  await Product.deleteProduct(productId);
  res.redirect('/admin/products');
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();
  if (products) {
    res.render('admin/products', { prods: products, docTitle: 'Admin Products', path: '/admin/products' });
  };
};