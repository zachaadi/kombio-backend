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

setupRoomSocketHandlers(io);
setupGameSocketHandlers(io);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
