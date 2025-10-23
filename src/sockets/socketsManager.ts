import {
  chatMessageHandler,
  sendSnackbar,
  createRoomHandler,
  getPlayersHandler,
  joinRoomHandler,
  disconnectHandler,
  reJoinRoomHandler
} from "./roomSocketHandlers.js";
import { Server } from "socket.io";


export function setupSocketHandlers(io: Server) {
  io.on("connection", (socket) => {

    socket.on("createRoom", async (roomId, playerName) => {
      await createRoomHandler(roomId, playerName, socket, io);
    });

    socket.on("getPlayers", async (roomId) => {
      await getPlayersHandler(roomId, socket, io);
    });

    socket.on("joinRoom", async (roomId, playerName) => {
      await joinRoomHandler(roomId, playerName, socket, io);
    });

    socket.on("reJoinRoom", async (roomId, playerName) => {
      await reJoinRoomHandler(roomId, playerName, socket, io)
    })

    socket.on("sendSnackbar", async (severity, message) => {
      await sendSnackbar(socket, severity, message);
    });

    socket.on("chatMessage", async (message) => {
      await chatMessageHandler(socket, message, io);
    });

    socket.on("disconnect", async () => {
      await disconnectHandler(socket);
    });
  });
}
