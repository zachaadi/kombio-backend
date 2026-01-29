import db from "../config/database.js";

async function postUser(query: any) {
  const collection = await db.collection("users");
  if (await collection.findOne({ email: query.email })) {
    throw new Error("Email already exists");
  } else if (await collection.findOne({ username: query.username })) {
    throw new Error("Username already exists");
  }
  const results = await collection.insertOne(query);
  return results;
}

export { postUser };
