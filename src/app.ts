import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config/socket";
import { setupSocketHandlers } from "./sockets/socketsManager";
import router from "./routes/expressRouter";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: config.cors,
});

app.use("/", router);

setupSocketHandlers(io);

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
