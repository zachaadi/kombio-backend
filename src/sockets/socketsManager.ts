import {
  newMessageHandler,
  sendSnackbar,
  createRoomHandler,
  getPlayersHandler,
  joinRoomHandler,
  disconnectHandler,
  reJoinRoomHandler,
  getMessagesHandler,
} from "./roomSocketHandlers.js";
import { Server } from "socket.io";

export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    socket.on("createRoom", async (roomId, playerName) => {
      await createRoomHandler(roomId, playerName, socket);
    });

    socket.on("getPlayers", async (roomId) => {
      await getPlayersHandler(roomId, socket);
    });

    socket.on("joinRoom", async (roomId, playerName) => {
      await joinRoomHandler(roomId, playerName, socket, io);
    });

    socket.on("reJoinRoom", async (roomId, playerName) => {
      await reJoinRoomHandler(roomId, playerName, socket, io);
    });

    socket.on("sendSnackbar", async (severity, message) => {
      await sendSnackbar(socket, severity, message);
    });

    socket.on("newMessage", async (message) => {
      await newMessageHandler(socket, message, io);
    });

    socket.on("getMessages", async (roomId) => {
      await getMessagesHandler(roomId, io);
    });

    socket.on("disconnect", async () => {
      await disconnectHandler(socket);
    });
  });
}
