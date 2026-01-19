import express from "express";
import { postUser } from "../services/usersService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const query = { email: req.body.email, username: req.body.username, password: req.body.password };
  let result = await postUser(query);
  res.status(200).json(result);
});

export default router;
