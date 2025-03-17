/**
 * @typedef {import("mongodb").MongoClient} MongoClient
 * @typedef {import("mongodb").Db} Db
 */

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const colors = require('colors');

/** @type {MongoClient} */
const client = new MongoClient('mongodb+srv://dev44:mongodb44@publickeys.9phag.mongodb.net/node-shop?retryWrites=true&w=majority&appName=PublicKeys');

/** @type {Db} */
let _db;

const connectDB = async (callback) => {
  try {
    await client.connect();
    _db = client.db();
    console.log('MongoDB Connected!'.bgGreen);
    callback();
  } catch (error) {
    console.error(err);
    throw err;
  }
}

const getDb = () => {
  if (_db) return _db;
  throw new Error('No database found!');
}

exports.connectDB = connectDB;
exports.getDb = getDb;