const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const getFilePath = () => {
  return path.join(rootDir, 'data', 'cart.json');
};

const getCart = async () => {
  let cart = { products: [], totalPrice: 0};
  // Fetch the previous cart
  const filePath = getFilePath();
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    cart = JSON.parse(data);
    return cart;
  } catch (error) {
    console.error('Error reading cart file:', error);
  }
}

module.exports = class Cart {

  static async addProduct(id, price) {
    const filePath = getFilePath();
    const cart = await getCart();
    // Analyze the cart => Find existing product
    const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].qty += 1;
    } else {
      cart.products.push({ id, qty: 1 });
    };

    // Update the total price
    cart.totalPrice += +price;

    // Save the updated cart
    try {
      await fs.promises.writeFile(filePath, JSON.stringify(cart, null, 2))
    } catch (error) {
      console.error('Error writing cart file:', error);
    }
  }

  static async deleteProduct(id, price) {
    const filePath = getFilePath();
    const cart = await getCart(); 
    const updatedCart = {...cart};
    const product = updatedCart.products.find(prod => prod.id === id);
    if (!product) return;
    const productQty = product.qty;
    updatedCart.products = updatedCart.products.filter(prod =>prod.id !== id)
    updatedCart.totalPrice = cart.totalPrice - price * productQty;

    try {
      await fs.promises.writeFile(filePath, JSON.stringify(updatedCart, null, 2))
    } catch (error) {
      console.error('Error writing cart file:', error);
    }
  };

  static async getCartProducts() {
    return await getCart(); 
  }
};