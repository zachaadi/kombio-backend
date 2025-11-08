import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config/socket.js";
import { setupRoomSocketHandlers } from "./sockets/roomSocketsManager.js";
import { setupGameSocketHandlers } from "./sockets/gameSocketManager.js";
import router from "./routes/expressRouter.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: config.cors,
});

app.use("/", router);

setupRoomSocketHandlers(io);
setupGameSocketHandlers(io);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
