const getDb = require('../util/database').getDb;
const ObjectId = require('mongodb').ObjectId;

module.exports = class User {
  constructor(username, email, cart, userId) {
    this.username = username;
    this.emai = email;
    this.cart = cart; // {items: []}
    this.userId = userId;
  };

  // Users
  async save() {
    const db = getDb();
    try {
      await db.collection('users').insertOne(this);
      return;
    } catch (error) {
      console.log(error);
    }
  };

  static async findById(userId) {
    const db = getDb();
    try {
      const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(userId) });
      if (user) return user;
    } catch (error) {
      console.log(error);
    }
  };

  // Cart
  async getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(prod => prod.productId);
    const products = await db.collection('products').find({ _id: {$in: productIds}}).toArray();
    const cart = products.map(prod => {
      return {
        ...prod,
        quantity: this.cart.items.find(p => {
          return p.productId.toString() === prod._id.toString();
        }).quantity
      };
    });
    return cart;
  };

  async addToCart(product) {
    const db = getDb();
    let updatedCart = this.cart ? this.cart : { items: [] };
    let productIndex = -1;

    if (updatedCart.items.length > 0) {
      productIndex = updatedCart.items.findIndex(prod => {
        let cartProductId = prod.productId.toString();
        let productId = product._id.toString();
        return cartProductId === productId;
      });
    };

    if (productIndex >= 0 ) {
      updatedCart.items[productIndex].quantity += 1;
    } else {
      updatedCart.items.push({ productId: product._id, quantity: 1});
    }

    await db.collection('users').updateOne({ _id: this.userId }, { $set: {cart: updatedCart }});
  };

  async removeFromCart(productId) {
    const db = getDb();
    const updatedItems = this.cart?.items.filter(prod => prod.productId?.toString() !== productId?.toString())
    await db.collection('users').updateOne({ _id: this.userId }, { $set: {cart: {items: updatedItems}}});
  };

  // Orders
  async createOrder() {
    const db = getDb();
    const cartProducts = await this.getCart();
    const order = {
      items: cartProducts,
      user: {
        _id: this.userId,
        name: this.username,
      },
    };
    await db.collection('orders').insertOne(order);
    this.cart = { items: []};
    await db.collection('users').updateOne({ _id: this.userId }, { $set: {cart: {items: [] }}});
  };

  async getOrders() {
    const db = getDb();
    return db.collection('orders').find({ 'user._id': this.userId }).toArray();
  }
};