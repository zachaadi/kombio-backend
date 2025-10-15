export const createRoomHandler = async (roomId, playerName, socket, io) => {
  // const roomExists = io.sockets.adapter.rooms.has(roomId);
  // if (roomExists) {
  //   socket.emit("error", "Room already exists");
  //   return;
  // }

  socket.data.playerName = playerName;
  socket.data.roomId = roomId;

  await socket.join(roomId);
  console.log(`User ${playerName} created and joined room: ${roomId}`);
  socket.emit("roomCreated", roomId, playerName);

  const sockets = await io.in(roomId).fetchSockets();
  const players = sockets.map((s) => s.data.playerName);
  io.to(roomId).emit("playersList", players);
};

export const getPlayersHandler = async (roomId, socket, io) => {
  const sockets = await io.in(roomId).fetchSockets();
  const players = sockets.map((s) => s.data.playerName);
  socket.emit("playersList", players);
  console.log("GETTING PLAYERS", players);
};

export const joinRoomHandler = async (roomId, playerName, socket, io) => {
  // const roomExists = io.sockets.adapter.rooms.has(roomId);
  // if (!roomExists) {
  //   socket.emit("error", "Room does not exist");
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
};

export const disconnectHandler = (socket) => {
  const roomId = socket.data.roomId;
  socket.to(roomId).emit("playerLeft", socket.data.playerName);
  console.log("A user disconnected");
};
