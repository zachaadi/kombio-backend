import {
  createRoomHandler,
  joinRoomHandler,
  reJoinRoomHandler,
  joinFromUrlHandler,
  getPlayersHandler,
  sendSnackbarHandler,
  newChatHandler,
  getChatHandler,
  editNameHandler,
  getRoomStatusHandler,
  readyUpHandler,
  removePlayerHandler,
  disconnectHandler,
} from "./roomSocketHandlers.js";

import { Server } from "socket.io";

export function setupRoomSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    socket.on("createRoom", async (roomId, playerName) => {
      await createRoomHandler(socket, roomId, playerName);
    });

    socket.on("joinRoom", async (roomId, playerName) => {
      await joinRoomHandler(io, socket, roomId, playerName);
    });

    socket.on("reJoinRoom", async (roomId, playerName) => {
      await reJoinRoomHandler(io, socket, roomId, playerName);
    });

    socket.on("joinFromUrl", async (roomId) => {
      await joinFromUrlHandler(io, socket, roomId);
    });

    socket.on("getPlayers", async (roomId) => {
      await getPlayersHandler(socket, roomId);
    });

    socket.on("sendSnackbar", async (severity, message) => {
      await sendSnackbarHandler(socket, severity, message);
    });

    socket.on("newChat", async (roomId, playerName, message) => {
      await newChatHandler(io, roomId, playerName, message);
    });

    socket.on("getChat", async (roomId) => {
      await getChatHandler(io, roomId);
    });

    socket.on("editName", async (roomId, playerName, newName) => {
      await editNameHandler(io, socket, roomId, playerName, newName);
    });

    socket.on("getRoomStatus", async (roomId) => {
      await getRoomStatusHandler(io, roomId);
    });

    socket.on("readyUp", async (roomId, playerName) => {
      await readyUpHandler(io, roomId, playerName);
    });

    socket.on("removePlayer", async (roomId, playerName) => {
      await removePlayerHandler(io, roomId, playerName);
    });

    socket.on("disconnect", async () => {
      await disconnectHandler(io, socket);
    });
  });
}
