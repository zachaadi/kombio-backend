import express from "express";
import { createUser, loginUser } from "../services/usersService.js";
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
    const query = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      role: "regular",
      accountCreationDate: new Date().toISOString().slice(0, 10),
      lastLoginDate: new Date().toISOString().slice(0, 10),
    };
    const results = await createUser(query);
    if (results) {
      const token = createToken(results.username, results.role);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(201).json({ username: results.username });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const query = {
      username: req.body.username,
      password: req.body.password,
      lastLoginDate: new Date().toISOString().slice(0, 10),
    };

    const results = await loginUser(query);
    if (results) {
      const token = createToken(results.username, results.role);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(200).json({ username: results.username });
    }
  } catch (error) {
    next(error);
  }
});

// router.get("/:username", async (req, res, next) => {
// });

// router.put("/:username", async (req, res, next) => {
// });

// router.delete("/:username", async (req, res, next) => {
// });

export default router;
