import {
  createRoomHandler,
  joinRoomHandler,
  reJoinRoomHandler,
  getPlayersHandler,
  sendSnackbarHandler,
  newMessageHandler,
  getMessagesHandler,
  editNameHandler,
  readyUpHandler,
  removePlayerHandler,
  disconnectHandler,
} from "./roomSocketHandlers.js";
import { Server } from "socket.io";

export function setupSocketHandlers(io: Server) {
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

    socket.on("getPlayers", async (roomId) => {
      await getPlayersHandler(socket, roomId);
    });

    socket.on("sendSnackbar", async (severity, message) => {
      await sendSnackbarHandler(socket, severity, message);
    });

    socket.on("newMessage", async (roomId, playerName, message) => {
      await newMessageHandler(io, roomId, playerName, message);
    });

    socket.on("getMessages", async (roomId) => {
      await getMessagesHandler(io, roomId);
    });

    socket.on("editName", async (roomId, playerName, newName) => {
      await editNameHandler(io, socket, roomId, playerName, newName);
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
