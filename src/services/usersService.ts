import db from "../config/database.js";
import bcrypt from "bcrypt";

async function createUser(query: any) {
  const collection = await db.collection("users");
  if (await collection.findOne({ email: query.email })) {
    throw new Error("Email already exists");
  } else if (await collection.findOne({ username: query.username })) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(query.password, 10);
  const updatedQuery = { ...query, password: hashedPassword };

  const results = await collection.insertOne(updatedQuery);
  return await collection.findOne({ _id: results.insertedId });
}

async function loginUser(query: any) {
  const collection = await db.collection("users");
  const user = await collection.findOne({ username: query.username });
  if (user) {
    if (await bcrypt.compare(query.password, user.password)) {
      return user;
    } else {
      throw new Error("Username or Password was incorrect");
    }
  } else {
    throw new Error("Username or Password was incorrect");
  }
}

export { createUser, loginUser };
