import {
  beginGameHandler,
  getGameHandler,
  newActionHandler,
  getActionsHandler,
  drawCardHandler,
  flipCardHandler,
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

    socket.on("drawCard", async (roomId, name) => {
      await drawCardHandler(io, roomId, name);
    });

    socket.on("flipCard", async (roomId, myName, id, name) => {
      await flipCardHandler(io, roomId, myName, id, name);
    });

    socket.on("nextTurn", async (roomId) => {
      await nextTurnHandler(io, roomId);
    });

    socket.on("endGame", async (roomId) => {
      await endGameHandler(io, roomId);
    });
  });
}
