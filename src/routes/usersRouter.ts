import express from "express";
import { postUser } from "../services/usersService.js";
import jwt, { SignOptions } from "jsonwebtoken";

const router = express.Router();

const createToken = (username: String, role: String) => {
  const payload = { username: username, role: role };
  const secret = process.env.JWT_SECRET;
  const options: SignOptions = { expiresIn: "1h" };
  if (!secret) {
    throw new Error("JWT is undefined");
  }
  return jwt.sign(payload, secret, options);
};

router.post("/create", async (req, res, next) => {
  try {
    //hash password
    const query = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      role: "regular",
      accountCreationDate: new Date().toISOString().slice(0, 10),
      lastLoginDate: new Date().toISOString().slice(0, 10),
    };
    const results = await postUser(query);
    if (results) {
      const token = createToken(results.username, results.role);
      res.status(201).json(token);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  //login user
});

router.get("/:username", async (req, res, next) => {
  //get profile
});

router.put("/:username", async (req, res, next) => {
  //edit profile
});

router.delete("/:username", async (req, res, next) => {
  //delete profile
});

export default router;
