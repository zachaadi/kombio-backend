import {
  beginGameHandler,
  getGameHandler,
  newActionHandler,
  getActionsHandler,
  viewCardHandler,
  nextTurnHandler,
  endGameHandler,
} from "./gameSocketHandlers.js";

import { Server } from "socket.io";

export function setupGameSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    socket.on("beginGame", async (roomId) => {
      await beginGameHandler(io, roomId);
    });

    socket.on("getGame", async (roomId) => {
      await getGameHandler(io, roomId);
    });

    socket.on("newAction", async (roomId, action) => {
      await newActionHandler(io, roomId, action);
    });

    socket.on("getActions", async (roomId) => {
      await getActionsHandler(io, roomId);
    });

    socket.on("viewCard", async (roomId, name, index) => {
      await viewCardHandler(socket, roomId, name, index)
    })

    socket.on("nextTurn", async (roomId) => {
      await nextTurnHandler(io, roomId);
    });

    socket.on("endGame", async (roomId) => {
      await endGameHandler(io, roomId);
    });
  });
}
