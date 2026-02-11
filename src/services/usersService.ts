import db from "../config/database.js";

async function postUser(query: any) {
  const collection = await db.collection("users");
  if (await collection.findOne({ email: query.email })) {
    throw new Error("Email already exists");
  } else if (await collection.findOne({ username: query.username })) {
    throw new Error("Username already exists");
  }
  const results = await collection.insertOne(query);
  return await collection.findOne({ _id: results.insertedId });
}

async function loginUser(query: any) {
  const collection = await db.collection("users");
  const user = await collection.findOne({ username: query.username });
  if (user) {
    if ((user.password = query.password)) {
      return user;
    }
  } else {
    throw new Error("Username or Password was incorrect");
  }
}

export { postUser, loginUser };
