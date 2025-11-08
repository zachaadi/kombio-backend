import { beginGameHandler, endGameHandler } from "./gameSocketHandlers.js";

import { Server } from "socket.io";

export function setupGameSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    socket.on("beginGame", async (roomId) => {
      await beginGameHandler(io, socket, roomId);
    });

    socket.on("endGame", async (roomId) => {
      await endGameHandler(io, socket, roomId);
    });
  });
}
