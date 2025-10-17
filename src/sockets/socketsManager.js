import { sendSnackbar, createRoomHandler, getPlayersHandler, joinRoomHandler, disconnectHandler } from "./roomSocketHandlers.js";

export function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    socket.on("createRoom", async (roomId, playerName) => {
      await createRoomHandler(roomId, playerName, socket, io);
    });

    socket.on("getPlayers", async (roomId) => {
      await getPlayersHandler(roomId, socket, io);
    });

    socket.on("joinRoom", async (roomId, playerName) => {
      await joinRoomHandler(roomId, playerName, socket, io);
    });

    socket.on("copyToClipboard", async () => {
      await sendSnackbar(socket);
    });

    socket.on("disconnect", async () => {
      await disconnectHandler(socket);
    });
  });
}
