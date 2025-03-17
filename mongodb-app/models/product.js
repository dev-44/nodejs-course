const getDb = require('../util/database').getDb;
const ObjectId = require('mongodb').ObjectId;

module.exports = class Product {
  
  constructor(title, imageUrl, price, description, _id, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this._id = _id ? ObjectId.createFromHexString(_id) : null;
    this.userId = userId;
  };

  async save() {
    const db = getDb();
    db.collection('products')
      .insertOne(this)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      })
  };

  static async fetchAll() {
    const db = getDb();
    try {
      const products = await db.collection('products').find().toArray();
      if (products) return products;
    } catch (error) {
      console.log(error);
    };
  };

  static async findById(prodId) {
    try {
      const db = getDb();
      if (!ObjectId.isValid(prodId)) {
        throw new Error('Invalid ObjectId format');
      };
      const product = await db.collection('products').find({ _id: ObjectId.createFromHexString(prodId) }).next();
      if (!product) {
        throw new Error('Product not found');
      };
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    };
  };

  async editProduct() {
    const db = getDb();
    try {
      const product = await db.collection('products').updateOne({ _id: this._id }, { $set: this });
      if (product) return product;
    } catch (error) {
      console.log(error);
    };
  };

  static async deleteProduct(prodId) {
    const db = getDb();
    try {
      await db.collection('products').deleteOne({ _id: ObjectId.createFromHexString(prodId) });
    } catch (error) {
      console.log(error);
    };
  };
}