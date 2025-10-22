import { Socket, Server } from "socket.io";

export const createRoomHandler = async (roomId: string, playerName: string, socket: Socket, io: Server) => {
  // const roomExists = io.sockets.adapter.rooms.has(roomId);
  // if (roomExists) {
  //   socket.emit("sendSnackbar", "error", "Room already exists");
  //   return;
  // }

  socket.data.playerName = playerName;
  socket.data.roomId = roomId;

  await socket.join(roomId);
  socket.emit("roomCreated", roomId, playerName);

  const sockets = await io.in(roomId).fetchSockets();
  const players = sockets.map((s) => s.data.playerName);
  io.to(roomId).emit("playersList", players);
  console.log("createRoomHandler");
};

export const getPlayersHandler = async (roomId: string, socket: Socket, io: Server) => {
  const sockets = await io.in(roomId).fetchSockets();
  const players = sockets.map((s) => s.data.playerName);
  socket.emit("playersList", players);
  console.log("getPlayersHandler");
};

export const joinRoomHandler = async (roomId: string, playerName: string, socket: Socket, io: Server) => {
  // const roomExists = io.sockets.adapter.rooms.has(roomId);
  // if (!roomExists) {
  //   socket.emit("sendSnackbar", "error", "Room does not exist");
  //   return;
  // }

  socket.data.playerName = playerName;
  socket.data.roomId = roomId;

  await socket.join(roomId);
  console.log(`User ${socket.id} joined room: ${roomId}`);

  io.to(roomId).emit("roomJoined", roomId, playerName);
  const sockets = await io.in(roomId).fetchSockets();
  const players = sockets.map((s) => s.data.playerName);
  io.to(roomId).emit("playersList", players);
  console.log("joinRoomHandler");
};

export const sendSnackbar = async (socket: Socket, severity: string, message: string) => {
  socket.emit("sendSnackbar", severity, message);
};

export const chatMessageHandler = async (socket: Socket, message: string, io: Server) => {
  const roomId = socket.data.roomId;
  const playerName = socket.data.playerName;
  io.to(roomId).emit("chatMessage", playerName, message);
};

export const disconnectHandler = (socket: Socket) => {
  const roomId = socket.data.roomId;
  socket.to(roomId).emit("playerLeft", socket.data.playerName);
  console.log("A user disconnected");
};
