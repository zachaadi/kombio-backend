import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config/socket.js";
import { setupRoomSocketHandlers } from "./sockets/roomSocketsManager.js";
import { setupGameSocketHandlers } from "./sockets/gameSocketManager.js";
import router from "./routes/expressRouter.js";
import usersRouter from "./routes/usersRouter.js";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: config.cors,
});

app.use(cors(config.cors));
app.use(express.json());

app.use("/", router);
app.use("/users", usersRouter);

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  if (error.message === "Username already exists") {
    res.status(409).json({ error: "Username already exists" });
  } else if (error.message === "Email already exists") {
    res.status(409).json({ error: "Email already exists" });
  } else {
    res.status(500).json("Something broke!");
  }
});

setupRoomSocketHandlers(io);
setupGameSocketHandlers(io);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
