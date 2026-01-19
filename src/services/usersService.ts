import db from "../config/database.js";

async function postUser(query: any) {
  const collection = await db.collection("users");
  const results = await collection.insertOne(query);
  return results;
}

export { postUser };
