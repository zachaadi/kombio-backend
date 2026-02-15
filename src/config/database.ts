import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.ATLAS_URI;
if (!uri) {
  throw new Error("ATLAS URI undefined");
}

const client = new MongoClient(uri);

const connection = await client.connect();
if (!connection) {
  throw new Error("Connection undefined");
}

const db = connection.db("kombio-db");

export default db;
