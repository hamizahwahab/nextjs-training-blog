// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let client = new MongoClient(uri, options);
let clientPromise = client.connect(); // This returns the promise

export default clientPromise;