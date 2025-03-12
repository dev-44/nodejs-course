const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');
const rootDir = require('../util/path');
const Cart = require('./cart');

const getFilePath = () => {
  return path.join(rootDir, 'data', 'products.json');
}

module.exports = class Product {
  
  constructor(id, title, imageUrl, price, description) {
    this.id = id
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  };

  async save() {
    this.id = Math.floor(Math.random() * 10000).toString();
    const filePath = getFilePath();
    let products = [];
    try {
      const data = await fs.promises.readFile(filePath, 'utf-8');
      products = JSON.parse(data);
      products.push(this);
      try {
        await fs.promises.writeFile(filePath, JSON.stringify(products, null, 2));
      } catch (error) {
        console.error('Error at writing products file');
      }
    } catch (error) {
      console.error('Error at reading products file');
    };


  };

  async editProduct() {
    const filePath = getFilePath();
    let products = [];
    try {
      const data = await fs.promises.readFile(filePath, 'utf-8');
      products = JSON.parse(data);
      const existingProductIndex = products.findIndex(prod => prod.id === this.id);
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex] = this;
      try {
        await fs.promises.writeFile(filePath, JSON.stringify(updatedProducts, null, 2));
      } catch (error) {
        console.error('Error at writing products file');
      }
    } catch (error) {
      console.error('Error at reading products file');
    }
  };

  static async deleteProduct(id) {
    const filePath = getFilePath();
    let products = [];
    try {
      const data = await fs.promises.readFile(filePath, 'utf-8');
      products = JSON.parse(data);
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(prod => prod.id !== id);
      try {
        await fs.promises.writeFile(filePath, JSON.stringify(updatedProducts, null, 2));
        await Cart.deleteProduct(id, product.price);
      } catch (error) {
        console.error('Error at writing products file');
      }
    } catch (error) {
      console.error('Error at reading products file');
    }
  }

  static fetchAll(cb) {
    const filePath = getFilePath();
    fs.readFile(filePath, (error, data) => {
      if (error) return cb([]);
      return cb(JSON.parse(data));
    })
  };

  static async findById(id) {
    const filePath = getFilePath();
    const data = await fsPromise.readFile(filePath, 'utf-8');
    const products = JSON.parse(data);
    return products.find(prod => prod.id === id);
  };
}