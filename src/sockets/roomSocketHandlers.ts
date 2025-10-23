import { Socket, Server } from "socket.io";
import { Room, activeRooms } from "../services/room.js";
import { Player } from "../services/player.js";

export const createRoomHandler = async (roomId: string, playerName: string, socket: Socket, io: Server) => {
  const roomExists = activeRooms.has(roomId);
  if (roomExists) {
    socket.emit("sendSnackbar", "error", "Room already exists");
    return;
  }

  const player = new Player(playerName, false, "admin");
  socket.data.playerName = playerName;
  socket.data.roomId = roomId;

  await socket.join(roomId);

  const room = await new Room(roomId, "open", [player], []);
  activeRooms.set(roomId, room);
  socket.emit("roomCreated", roomId);
  const players = room.players.map((player) => player.name);

  socket.emit("playersList", players);
  console.log("createRoomHandler");
};

export const getPlayersHandler = async (roomId: string, socket: Socket, io: Server) => {
  const room = activeRooms.get(roomId);
  if (room) {
    const players = room.players.map((player) => player.name);
    socket.emit("playersList", players);
  }
  console.log("getPlayersHandler");
};

export const joinRoomHandler = async (roomId: string, playerName: string, socket: Socket, io: Server) => {
  const roomExists = activeRooms.has(roomId);
  if (!roomExists) {
    socket.emit("sendSnackbar", "error", "Room does not exist");
    return;
  }

  socket.data.playerName = playerName;
  socket.data.roomId = roomId;

  const player = new Player(playerName, false, "regular");
  const room = activeRooms.get(roomId);

  room?.players.push(player);

  await socket.join(roomId);

  socket.emit("roomJoined", roomId);

  const players = room?.players.map((player) => player.name);

  io.to(roomId).emit("playersList", players);
  console.log("joinRoomHandler");
};

export const reJoinRoomHandler = async (roomId: string, playerName: string, socket: Socket, io: Server) => {
  const roomExists = activeRooms.has(roomId);
  if (!roomExists) {
    createRoomHandler(roomId, playerName, socket, io);
  } else {
    joinRoomHandler(roomId, playerName, socket, io);
  }
  console.log("reJoinRoomHandler");
};

export const sendSnackbar = async (socket: Socket, severity: string, message: string) => {
  socket.emit("sendSnackbar", severity, message);
  console.log("sendSnackbar");
};

export const chatMessageHandler = async (socket: Socket, message: string, io: Server) => {
  const roomId = socket.data.roomId;
  const playerName = socket.data.playerName;
  io.to(roomId).emit("chatMessage", playerName, message);
  console.log("chatMessageHandler");
};

export const disconnectHandler = (socket: Socket) => {
  const roomId = socket.data.roomId;

  const room = activeRooms.get(roomId);
  if (room) {
    const playerIndex = room.players.findIndex((player) => player.name === socket.data.playerName);

    if (playerIndex != -1) {
      room?.players.splice(playerIndex, 1);
    }

    const playersInRoom = room?.players.length;
    if (playersInRoom === 0) {
      activeRooms.delete(roomId);
    }

    socket.to(roomId).emit("playerLeft", socket.data.playerName);
  }
  console.log("disconnectHandler");
};
