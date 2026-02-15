import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config/socket.js";
import { setupRoomSocketHandlers } from "./sockets/roomSocketsManager.js";
import { setupGameSocketHandlers } from "./sockets/gameSocketManager.js";
import router from "./routes/expressRouter.js";
import usersRouter from "./routes/usersRouter.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: config.cors,
});

app.use(cors(config.cors));
app.use(express.json());
app.use(cookieParser());

export function verifyToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "token not provided" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new Error("secret is undefined"));
    }

    jwt.verify(token, secret);
    next();
  } catch (error) {
    return res.status(401).json({ message: "invalid or expired token" });
  }
}

app.use("/", router);
app.use("/users", usersRouter);

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  if (error.message === "Username already exists") {
    res.status(409).json({ error: "Username already exists" });
  } else if (error.message === "Email already exists") {
    res.status(409).json({ error: "Email already exists" });
  } else if (error.message === "Username or Password was incorrect") {
    res.status(400).json({ error: "Username or Password was incorrect" });
  } else {
    res.status(500).json({ error: "Something broke!" });
  }
});

setupRoomSocketHandlers(io);
setupGameSocketHandlers(io);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
